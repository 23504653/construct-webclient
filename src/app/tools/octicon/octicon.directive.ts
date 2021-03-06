import { Directive, Input, ElementRef, Renderer2, OnInit, NgModule } from '@angular/core';
import * as octicons from 'octicons';

@Directive({
  selector: '[octicon]'
})
export class OcticonDirective implements OnInit{

  @Input() octicon: string;
  @Input() color: string;
  @Input() width: number;
  
  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    const el: HTMLElement = this.elementRef.nativeElement;
    el.innerHTML = octicons[this.octicon].toSVG();

    const icon: Node = el.firstChild;
    if (this.color) {
      this.renderer.setStyle(icon, 'fill', this.color)
    }
    if (this.width) {
        this.renderer.setStyle(icon, 'width', this.width);
        this.renderer.setStyle(icon, 'height', '100%');
        this.renderer.setAttribute(icon, "height", this.width.toString());
        this.renderer.setAttribute(icon, "width", this.width.toString())
    }
}

}


@NgModule({
  declarations: [OcticonDirective],
  exports: [OcticonDirective],
})
export class OcticonModule {}