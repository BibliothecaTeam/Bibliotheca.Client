// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  site_title: "Bibliotheca",
  site_custom_style_url: "node_modules/admin-lte/dist/css/skins/skin-blue.css",
  site_custom_style_name: "skin-blue",
  api_url: "http://localhost:5000",
  web_url: "http://localhost:3000",
  footer_name: "Bibliotheca",
  footer_url: "http://bibliotheca.com",
  oauth_tenant: "",
  oauth_clientid: ""
};
