import { GObject } from 'gamedeck/lib/GObject';
import { Vector2 } from 'gamedeck/lib/Utils';
import { Ellipse } from 'gamedeck/lib/assets/Ellipse';

export class Ball extends GObject {
  constructor(props: { position: Vector2; radius: number; color: string }) {
    super({
      position: props.position,
      dimensions: new Vector2(props.radius * 2, props.radius * 2)
    });
    this.sprite = new Ellipse(props.radius, props.radius, props.color);
  }
}
