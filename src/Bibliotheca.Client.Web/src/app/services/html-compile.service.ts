import { Component, Compiler, NgModule, Injectable } from '@angular/core';
import { HtmlCompileOptions } from "../entities/html-compile-options";

function prepareTemplate(template: string){
    template = template || '';
    const regex = /(&#123;&#123;.*?&#125;&#125;|{{.*?}})/g;
    let m;
    while ((m = regex.exec(template)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        template = template.replace(m[0], `<span ngNonBindable>${m[0]}</span>`)
    }
    return template;
}

@Injectable()
export class HtmlCompileService  {

    constructor(private compiler: Compiler) {}

    public compile(opts: HtmlCompileOptions) {

        @Component({
            template: prepareTemplate(opts.template)
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