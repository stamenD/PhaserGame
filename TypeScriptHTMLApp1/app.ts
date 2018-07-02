module GameFromScratch {
    export class TitleScreenState extends Phaser.State {
        game: Phaser.Game;

        constructor() {
            super();
        }
        titleClicked() {
            this.game.state.start("GameRunningState");
        }
        init() {
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        }
        create() {
            this.game.stage.backgroundColor = "#4488AA";
            this.game.input.onTap.addOnce(this.titleClicked, this); // <-- that um, this is extremely important
        }
    }
    export class GameRunningState extends Phaser.State {
        cursors: Phaser.CursorKeys;
        bird: Phaser.Sprite;
        ball: Phaser.Sprite;
        orientation: number;
        pitchSprite: Phaser.Sprite;
        rightEmitter: Phaser.Particles.Arcade.Emitter;
        game: Phaser.Game;
        W: Phaser.Key;
        A: Phaser.Key;
        S: Phaser.Key;
        D: Phaser.Key;
        power: number;
        timer: Phaser.TimerEvent
        moveDown(e: KeyboardEvent) {

        }
        powerUp() {
            this.S.onDown.remove(this.powerUp, this);
            this.timer = this.game.time.events.loop(Phaser.Timer.SECOND / 1000, this.increasePower, this);
            this.S.onUp.add(this.powerDown, this);
        }
        powerDown() {
            this.S.onUp.remove(this.powerDown, this);
            this.ball.body.velocity.y = -this.power * 12;
            this.game.time.events.remove(this.timer);
            this.power = 0;
            this.S.onDown.add(this.powerUp, this);
            //this.ball.width = 0;
        }
        increasePower() {
            this.power++;
            //this.ball.width = this.power;
            if (this.power > 50) {
                this.power = 50;
            }
        }

        constructor() {
            super();
        }
        init() {
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        }
        preload() {
            // this.game.load.audio("GameMusic", ["win.wav"]);
            this.game.load.image("particle", "image.png");
            this.game.load.image("pitch", "1.png");
            this.game.load.image("ball", "eight-ball.png");
            // Load the spritesheet containing the frames of animation of our bird
            // The cells of animation are 240x314 and there are 22 of them
            this.game.load.spritesheet("ss", "robin.png", 240, 314, 22);
        }
        create() {

            this.power = 0;
            //this.soundd = this.game.add.audio('GameMusic');
            //this.soundd.play();

            this.bird = this.game.add.sprite(100, 100, "ss", 0);
            this.bird.anchor.setTo(.5, .5);


            this.ball = this.game.add.sprite(400, 400, "ball");
            this.ball.anchor.setTo(.5, .5);



            // Create an animation using all available frames
            this.bird.animations.add("fly");
            // Play the animation we just created at 10fps, looping forever
            this.bird.animations.play("fly", 10, true);
            this.orientation = 1;
            this.bird.scale.x *= -1;


            this.pitchSprite = this.game.add.sprite(0, 0, "pitch");
            this.pitchSprite.anchor.set(0.5, 0.5)
            this.pitchSprite.position.x = this.game.width / 2 + 300;
            this.pitchSprite.position.y = this.game.height / 2;


            this.game.physics.enable(this.bird);
            this.game.physics.enable(this.pitchSprite);
            this.game.physics.enable(this.ball);
            //this.ball.body.bounce.set(1);
            this.ball.body.gravity.y = 200;
            //this.ball.body.velocity.set(150, 150);
            this.ball.body.collideWorldBounds = true;
            this.pitchSprite.body.immovable = true;

            this.pitchSprite.scale.setTo(window.devicePixelRatio / 8, window.devicePixelRatio / 8);
            // this.bird.scale.setTo(window.devicePixelRatio / 8, window.devicePixelRatio / 8);
            this.ball.scale.setTo(window.devicePixelRatio / 8, window.devicePixelRatio / 8);

            //**************************************************************************************************************************************************

            this.rightEmitter = this.game.add.emitter(this.game.world.centerX + 250, this.game.world.centerY - 200);
            this.rightEmitter.bounce.setTo(0.5, 0.5);
            this.rightEmitter.setXSpeed(-100, -200);
            this.rightEmitter.setYSpeed(-50, 50);
            this.rightEmitter.makeParticles('particle', 0, 250, true, true);
            //this.rightEmitter.start(false, 5000, 20);
            
            //**************************************************************************************************************************************************

            // Create a key for each WASD key
            this.W = this.game.input.keyboard.addKey(Phaser.KeyCode.W);
            this.A = this.game.input.keyboard.addKey(Phaser.KeyCode.A);
            this.S = this.game.input.keyboard.addKey(Phaser.KeyCode.S);
            this.D = this.game.input.keyboard.addKey(Phaser.KeyCode.D);
            this.S.onDown.add(GameRunningState.prototype.powerUp, this);
        

        }
        update() {

            if (this.orientation == 1 && this.bird.position.x < 400) {
                //    console.log(1)
                this.bird.position.x += 4;
            }
            if (this.orientation == 1 && this.bird.position.x >= 400) {
                //    console.log(2)
                this.bird.scale.x *= -1;
                this.orientation = 0;
            }
            if (this.orientation == 0 && this.bird.position.x > 100) {
                //     console.log(3)
                this.bird.position.x -= 4;
            }
            if (this.orientation == 0 && this.bird.position.x <= 100) {
                //    console.log(4)
                this.bird.scale.x *= -1;
                this.orientation = 1;
            }

            //this.game.physics.arcade.collide(this.pitchSprite, this.rightEmitter);
            this.game.physics.arcade.collide(this.pitchSprite, this.ball, () => { console.log("1") });
            this.game.physics.arcade.collide(this.bird, this.pitchSprite, () => { console.log("2"); this.rightEmitter.start(false, 5000, 20); });

            // You can poll mouse status
            if (this.input.activePointer.isDown) {
                //console.log(this.input.activePointer)
                if (Math.abs(this.input.activePointer.position.x - this.pitchSprite.x) > 2.4)
                    if (this.input.activePointer.position.x > this.pitchSprite.x)
                        this.pitchSprite.x += 3;
                    else
                        this.pitchSprite.x -= 3;

                // console.log("y:", this.input.activePointer.position.y - this.pitchSprite.y)
                //console.log("x:", this.input.activePointer.position.x - this.pitchSprite.x)

                if (Math.abs(this.input.activePointer.position.y - this.pitchSprite.y) > 2.4)
                    if (this.input.activePointer.position.y > this.pitchSprite.y) {
                        this.pitchSprite.y += 3;
                    }
                    else
                        this.pitchSprite.y -= 3;

            }

            // Wire up an event handler for each K.  The handler is a Phaser.Signal attached to the Key Object
            if (this.W.isDown) {
                this.pitchSprite.position.y++;
            }
        }



    }
    export class SimpleGame {
        game: Phaser.Game;

        constructor() {

            this.game = new Phaser.Game(
                window.innerWidth * window.devicePixelRatio,
                window.innerHeight * window.devicePixelRatio,
                Phaser.CANVAS,
                'canvasholder');
            this.game.state.add("GameRunningState", GameRunningState, false);
            this.game.state.add("TitleScreenState", TitleScreenState, false);
            this.game.state.start("TitleScreenState", true, true);
        }

    }
}

window.onload = () => {
    var game = new GameFromScratch.SimpleGame();
};