import { GObject } from 'gamedeck/lib/GObject';
import { Vector2 } from 'gamedeck/lib/Utils';
import { Ellipse } from 'gamedeck/lib/assets/Ellipse';
import { PubSub } from '../PubSub';

export type fireflyBlink = [Vector2, number];

export class FireflyState {
  CLOCK_MAX = 100;
  CLOCK_BUMP = 6;
  FIRE = false;
  on = false;
  velocity = new Vector2(0, 0);

  constructor(
    public position: Vector2,
    public radius: number,
    private pubsub: PubSub,
    public clock = -1
  ) {
    if (clock === -1) {
      this.clock = Math.floor(Math.random() * this.CLOCK_MAX);
    }
    pubsub.subscribe<fireflyBlink>('firefly', message => {
      if (message[0].add(this.position.invert()).getMagnitude() < message[1]) {
        this.bump();
      }
    });
  }

  tick() {
    if (this.clock >= this.CLOCK_MAX) {
      this.blink();
      this.pubsub.publish<fireflyBlink>('firefly', [this.position, 200]);
    } else {
      this.clock++;
    }
  }

  blink() {
    this.on = true;
    setTimeout(() => {
      this.on = false;
      this.clock = 0;
    }, 200);
  }

  bump() {
    if (this.clock <= this.CLOCK_MAX) {
      this.clock += this.CLOCK_BUMP;
    }
  }
}

export class Firefly extends GObject {
  constructor(state: FireflyState) {
    super({
      position: state.position,
      dimensions: new Vector2(state.radius * 2, state.radius * 2)
    });
    this.sprite = new Ellipse(
      state.radius,
      state.radius,
      state.on ? 'yellow' : 'white'
    );
  }
}
