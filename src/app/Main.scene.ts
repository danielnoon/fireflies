import { Scene } from 'gamedeck/lib/Scene';
import { Game } from 'gamedeck/lib/Game';
import { Rectangle } from 'gamedeck/lib/GObjects';
import { Vector2 } from 'gamedeck/lib/Utils';
import { FireflyState, Firefly } from './gobjects/Firefly.go';
import { PubSub } from './PubSub';

export class Main extends Scene {
  FIREFLY_RADIUS = 15;
  NUM_FIREFLIES = 100;
  fireflies: FireflyState[] = [];
  pubsub = new PubSub();

  constructor() {
    super();
    for (let i = 0; i < this.NUM_FIREFLIES; i++) {
      this.fireflies.push(
        new FireflyState(
          this.getRandomVec2InWindow(),
          this.FIREFLY_RADIUS,
          this.pubsub
        )
      );
    }
  }

  getRandomVec2InWindow() {
    let width = window.innerWidth;
    let height = window.innerHeight;

    return this.getRandomVec2(width, height);
  }

  getRandomVec2(maxX: number, maxY: number, minX = 0, minY = 0) {
    let x = Math.random() * (maxX - minX) + minX;
    let y = Math.random() * (maxY - minY) + minY;

    return new Vector2(x, y);
  }

  build(game: Game) {
    return new Rectangle({
      color: 'black',
      x: 0,
      y: 0,
      width: game.width,
      height: game.height,
      children: [...this.fireflies.map(state => new Firefly(state))]
    });
  }

  update(game: Game) {
    game.setTimer('tick', '10ms', () => {
      this.fireflies.forEach(firefly => {
        firefly.tick();
        const acceleration = this.getRandomVec2(1, 1, -1, -1);
        if (firefly.velocity.add(acceleration).getMagnitude() < 4) {
          firefly.velocity.addM(acceleration);
        }
      });
    });

    this.fireflies.forEach(firefly => {
      const w = game.width;
      const h = game.height;
      firefly.position.addM(firefly.velocity);
      if (firefly.position.x > w + this.FIREFLY_RADIUS + 10) {
        firefly.position.x = -this.FIREFLY_RADIUS;
      }
      if (firefly.position.x < -this.FIREFLY_RADIUS - 10) {
        firefly.position.x = w;
      }
      if (firefly.position.y > h + this.FIREFLY_RADIUS + 10) {
        firefly.position.y = -this.FIREFLY_RADIUS;
      }
      if (firefly.position.y < -this.FIREFLY_RADIUS - 10) {
        firefly.position.y = h;
      }
    });
  }
}
