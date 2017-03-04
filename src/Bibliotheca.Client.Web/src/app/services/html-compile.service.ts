import { Component, Compiler, NgModule, Injectable } from '@angular/core';
import { HtmlCompileOptions } from "../entities/html-compile-options";

@Injectable()
export class HtmlCompileService  {

    constructor(private compiler: Compiler) {}

    public compile(opts: HtmlCompileOptions) {

        @Component({
            template: opts.template || ''
        })
        class TemplateComponent {
            ref = opts.ref;
        }
        @NgModule({
            imports: opts.imports,
            declarations: [TemplateComponent]
        })
        class TemplateModule {}
        const compiled = this.compiler.compileModuleAndAllComponentsSync(TemplateModule);
        const factory = compiled.componentFactories.find((comp) =>
            comp.componentType === TemplateComponent
        );
        opts.container.clear();
        opts.container.createComponent(factory);
    }
}