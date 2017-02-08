import { ViewContainerRef } from '@angular/core';

export interface HtmlCompileOptions {
    template: string;
    container: ViewContainerRef;
    imports?: any[];
    ref?: any
}


