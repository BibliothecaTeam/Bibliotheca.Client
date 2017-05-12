@if "%SCM_TRACE_LEVEL%" NEQ "4" @echo off

:: ----------------------
:: KUDU Deployment Script
:: Version: 1.0.6
:: ----------------------

:: Prerequisites
:: -------------

:: Verify node.js installed
where node 2>nul >nul
IF %ERRORLEVEL% NEQ 0 (
  echo Missing node.js executable, please install node.js, if already installed make sure it can be reached from current environment.
  goto error
)

:: Setup
:: -----

setlocal enabledelayedexpansion

SET ARTIFACTS=%~dp0%..\artifacts

IF NOT DEFINED DEPLOYMENT_SOURCE (
  SET DEPLOYMENT_SOURCE=%~dp0%.
)

IF NOT DEFINED DEPLOYMENT_TARGET (
  SET DEPLOYMENT_TARGET=%ARTIFACTS%\wwwroot
)

IF NOT DEFINED NEXT_MANIFEST_PATH (
  SET NEXT_MANIFEST_PATH=%ARTIFACTS%\manifest

  IF NOT DEFINED PREVIOUS_MANIFEST_PATH (
    SET PREVIOUS_MANIFEST_PATH=%ARTIFACTS%\manifest
  )
)

IF NOT DEFINED KUDU_SYNC_CMD (
  :: Install kudu sync
  echo Installing Kudu Sync
  call npm install kudusync -g --silent
  IF !ERRORLEVEL! NEQ 0 goto error

  :: Locally just running "kuduSync" would also work
  SET KUDU_SYNC_CMD=%appdata%\npm\kuduSync.cmd
)
goto Deployment

:: Utility Functions
:: -----------------

:SelectNodeVersion

IF DEFINED KUDU_SELECT_NODE_VERSION_CMD (
  :: The following are done only on Windows Azure Websites environment
  call %KUDU_SELECT_NODE_VERSION_CMD% "%DEPLOYMENT_SOURCE%" "%DEPLOYMENT_TARGET%" "%DEPLOYMENT_TEMP%"
  IF !ERRORLEVEL! NEQ 0 goto error

  IF EXIST "%DEPLOYMENT_TEMP%\__nodeVersion.tmp" (
    SET /p NODE_EXE=<"%DEPLOYMENT_TEMP%\__nodeVersion.tmp"
    IF !ERRORLEVEL! NEQ 0 goto error
  )

  IF EXIST "%DEPLOYMENT_TEMP%\__npmVersion.tmp" (
    SET /p NPM_JS_PATH=<"%DEPLOYMENT_TEMP%\__npmVersion.tmp"
    IF !ERRORLEVEL! NEQ 0 goto error
  )

  IF NOT DEFINED NODE_EXE (
    SET NODE_EXE=node
  )

  SET NPM_CMD="!NODE_EXE!" "!NPM_JS_PATH!"
) ELSE (
  SET NPM_CMD=npm
  SET NODE_EXE=node
)

goto :EOF

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: Deployment
:: ----------

:Deployment
echo Handling node.js deployment.

:: 1. KuduSync
IF /I "%IN_PLACE_DEPLOYMENT%" NEQ "1" (
  call :ExecuteCmd "%KUDU_SYNC_CMD%" -v 50 -f "%DEPLOYMENT_SOURCE%" -t "%DEPLOYMENT_TARGET%" -n "%NEXT_MANIFEST_PATH%" -p "%PREVIOUS_MANIFEST_PATH%" -i ".git;.hg;.deployment;deploy.cmd"
  IF !ERRORLEVEL! NEQ 0 goto error
)

:: 2. Select node version
call :SelectNodeVersion

:: 3. Install npm packages
IF EXIST "%DEPLOYMENT_TARGET%\package.json" (
  pushd "%DEPLOYMENT_TARGET%"
  call :ExecuteCmd !NPM_CMD! install
  IF !ERRORLEVEL! NEQ 0 goto error
  popd
)

:: 4. Create configuration file
(
  echo export const environment = {
  echo    production: true,
  echo    site_title: "%SiteTitle%",
  echo    site_custom_style_url: "%SiteCustomStyleUrl%",
  echo    site_custom_style_name: "%SiteCustomStyleName%",
  echo    api_url: "%ApiUrl%",
  echo    web_url: "%WebUrl%",
  echo    footer_name: "%FooterName%",
  echo    footer_url: "%FooterUrl%",
  echo    oauth_tenant: "%OAuthTenant%",
  echo    oauth_clientid: "%OAuthClientId%",
  echo    version: "1.3.0",
  echo    build: "%SCM_COMMIT_ID%"
  echo };
) > "%DEPLOYMENT_TARGET%"\src\environments\environment.prod.ts

:: 5. Compile TypeScript
echo Transpiling TypeScript
pushd "%DEPLOYMENT_TARGET%"
call :ExecuteCmd node "%DEPLOYMENT_TARGET%\node_modules\@angular\cli\bin\ng" build --prod --aot false --pr false

:: 6. Copy web.config
echo Copying web config
call copy web.config dist\

:: 7. Copy custom styles if exists
IF EXIST "%HOME%\site\assets\%SiteCustomStyleUrl%" (
  echo Copying custom css styles
  call copy "%HOME%\site\assets\%SiteCustomStyleUrl%" "%DEPLOYMENT_TARGET%\dist\%SiteCustomStyleUrl%"
)

:: 8. Copy custom logo if exists
IF EXIST "%HOME%\site\assets\logo-white.svg" (
  echo Copying custom big logo
  call copy "%HOME%\site\assets\logo-white.svg" "%DEPLOYMENT_TARGET%\dist\assets\logo-white.svg"
)

:: 9. Copy custom small logo if exists
IF EXIST "%HOME%\site\assets\logo-small-white.svg" (
  echo Copying custom small logo
  call copy "%HOME%\site\assets\logo-small-white.svg" "%DEPLOYMENT_TARGET%\dist\assets\logo-small-white.svg"
)

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

:: Post deployment stub
IF DEFINED POST_DEPLOYMENT_ACTION call "%POST_DEPLOYMENT_ACTION%"
IF !ERRORLEVEL! NEQ 0 goto error

goto end

:: Execute command routine that will echo out when error
:ExecuteCmd
setlocal
set _CMD_=%*
call %_CMD_%
if "%ERRORLEVEL%" NEQ "0" echo Failed exitCode=%ERRORLEVEL%, command=%_CMD_%
exit /b %ERRORLEVEL%

:error
endlocal
echo An error has occurred during web site deployment.
call :exitSetErrorLevel
call :exitFromFunction 2>nul

:exitSetErrorLevel
exit /b 1

:exitFromFunction
()

:end
endlocal
echo Finished successfully.