import { Directive, Input, Injectable, ViewContainerRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { HtmlCompileService } from '../../services/htmlCompile.service';
import { ToasterService } from 'angular2-toaster';

@Directive({ selector: '[html-compile]' })
@Injectable()
export class HtmlCompileAttribute implements OnInit, OnChanges{

    @Input('html-compile') html: string;
    @Input('html-compile-ref') compileHtmlRef: any;
    @Input('html-compile-imports') compileHtmlImports: any[];

    update() {
        try
        {
            this.service.compile({
                template: this.html,
                container: this.container,
                ref: this.compileHtmlRef,
                imports: this.compileHtmlImports
            });
        }
        catch(e) {
            console.log('An error has occurred: ' + e.message)
            this.toaster.pop('error', 'Error', 'Error during parsing documentation.');
        }
    }

    ngOnInit() {
        this.update();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.update();
    }

    constructor(
        private container: ViewContainerRef,
        private service: HtmlCompileService,
        private toaster: ToasterService
    ) {}
}