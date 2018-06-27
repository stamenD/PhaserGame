var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GameFromScratch;
(function (GameFromScratch) {
    var TitleScreenState = /** @class */ (function (_super) {
        __extends(TitleScreenState, _super);
        function TitleScreenState() {
            return _super.call(this) || this;
        }
        TitleScreenState.prototype.moveLeft = function () {
            this.pitchSprite.position.x--;
            // this.pitchSprite.position.add(-1, 0);
        };
        TitleScreenState.prototype.moveRight = function () {
            this.pitchSprite.position.x++;
            //this.pitchSprite.position.add(1, 0);
        };
        TitleScreenState.prototype.moveUp = function (e) {
            // As you can see the event handler is passed an optional event KeyboardEvent
            // This contains additional information about the key, including the Control
            // key status.
            // Basically if the control key is held, we move up or down by 5 instead of 1
            if (e.ctrlKey)
                this.pitchSprite.position.add(0, -5);
            else
                this.pitchSprite.position.add(0, -1);
        };
        TitleScreenState.prototype.moveDown = function (e) {
            if (e.ctrlKey)
                this.pitchSprite.position.add(0, 1);
            else
                this.pitchSprite.position.add(0, 1);
        };
        TitleScreenState.prototype.init = function () {
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        };
        TitleScreenState.prototype.preload = function () {
            // Load the image we are going to use for our particle
            this.game.load.image("particle", "image.png");
            // this.game.load.audio("GameMusic", ["win.wav"]);
            this.game.load.image("pitch", "1.png");
        };
        TitleScreenState.prototype.create = function () {
            // this.emitter = this.game.add.emitter(this.game.world.centerX, 0);
            //this.emitter.makeParticles('particle', 1, 500, false, false);
            // this.emitter.explode(10000, 500);
            //this.soundd = this.game.add.audio('GameMusic');
            //this.soundd.play();
            // var image = this.game.cache.getImage("pitch");
            this.pitchSprite = this.game.add.sprite(0, 0, 
            //this.game.width / 2 - image.width / 2,
            //this.game.height / 2 - image.height / 2,
            "pitch");
            this.game.physics.enable(this.pitchSprite);
            this.pitchSprite.body.immovable = true;
            this.pitchSprite.scale.setTo(window.devicePixelRatio / 8, window.devicePixelRatio / 8);
            //**************************************************************************************************************************************************
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.leftEmitter = this.game.add.emitter(this.game.world.centerX - 250, this.game.world.centerY - 200);
            this.leftEmitter.bounce.setTo(0.5, 0.5);
            this.leftEmitter.setXSpeed(100, 200);
            this.leftEmitter.setYSpeed(-50, 50);
            this.leftEmitter.makeParticles('particle', 0, 250, true, true);
            this.rightEmitter = this.game.add.emitter(this.game.world.centerX + 250, this.game.world.centerY - 200);
            this.rightEmitter.bounce.setTo(0.5, 0.5);
            this.rightEmitter.setXSpeed(-100, -200);
            this.rightEmitter.setYSpeed(-50, 50);
            this.rightEmitter.makeParticles('particle', 0, 250, true, true);
            // explode, lifespan, frequency, quantity
            this.leftEmitter.start(false, 5000, 20);
            this.rightEmitter.start(false, 5000, 20);
            //**************************************************************************************************************************************************
            this.pitchSprite.anchor.set(0.5, 0.5);
            this.pitchSprite.position.x = this.game.width / 2 + 300;
            this.pitchSprite.position.y = this.game.height / 2;
            // create the cursor key object
            this.cursors = this.game.input.keyboard.createCursorKeys();
            //  this.game.input.onTap.addOnce(this.titleClicked, this); // <-- that um, this is extremely important
            // Create a key for each WASD key
            this.W = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
            this.A = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
            this.S = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
            this.D = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
            // Since we are allowing the combination of CTRL+W, which is a shortcut for close window
            // we need to trap all handling of the W key and make sure it doesnt get handled by 
            // the browser.  
            // Unfortunately you can no longer capture the CTRL+W key combination in Google Chrome
            // except in "Application Mode" because apparently Google thought an unstoppable un prompted
            // key combo of death was a good idea...
            this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.W);
        };
        TitleScreenState.prototype.update = function () {
            this.game.physics.arcade.collide(this.pitchSprite, this.leftEmitter);
            this.game.physics.arcade.collide(this.pitchSprite, this.rightEmitter);
            this.game.physics.arcade.collide(this.leftEmitter, this.rightEmitter);
            // You can poll mouse status
            if (this.input.activePointer.isDown) {
                console.log(this.input.activePointer);
                // player walks
                if (Math.abs(this.input.activePointer.position.x - this.pitchSprite.x) > 2.4)
                    if (this.input.activePointer.position.x > this.pitchSprite.x)
                        this.pitchSprite.x += 3;
                    else
                        this.pitchSprite.x -= 3;
                console.log("y:", this.input.activePointer.position.y - this.pitchSprite.y);
                console.log("x:", this.input.activePointer.position.x - this.pitchSprite.x);
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
            // this.W.onDown.add(TitleScreenState.prototype.moveUp, this);
            this.A.onDown.add(TitleScreenState.prototype.moveLeft, this);
            this.S.onDown.add(TitleScreenState.prototype.moveDown, this);
            this.D.onDown.add(TitleScreenState.prototype.moveRight, this);
            // Update input state
            this.game.input.update();
            // Check each of the arrow keys and move accordingly
            // If the Ctrl Key + Left or Right arrow are pressed, move at a greater rate
            if (this.cursors.down.isDown)
                this.pitchSprite.position.y++;
            if (this.cursors.up.isDown)
                this.pitchSprite.position.y--;
            if (this.cursors.left.isDown) {
                if (this.cursors.left.ctrlKey)
                    this.pitchSprite.position.x -= 5;
                else
                    this.pitchSprite.position.x--;
            }
            if (this.cursors.right.isDown) {
                if (this.cursors.right.ctrlKey)
                    this.pitchSprite.position.x += 5;
                else
                    this.pitchSprite.position.x++;
            }
        };
        TitleScreenState.prototype.titleClicked = function () {
            this.game.state.start("GameRunningState");
        };
        return TitleScreenState;
    }(Phaser.State));
    GameFromScratch.TitleScreenState = TitleScreenState;
    var GameRunningState = /** @class */ (function (_super) {
        __extends(GameRunningState, _super);
        function GameRunningState() {
            return _super.call(this) || this;
        }
        GameRunningState.prototype.create = function () {
            // Add a graphics object to our game
            var graphics = this.game.add.graphics(0, 0);
            // Create an array to hold the points that make up our triangle
            var points = [];
            // Add 4 Point objects to it
            points.push(new Phaser.Point());
            points.push(new Phaser.Point());
            points.push(new Phaser.Point());
            // Position one top left, top right and botto mmiddle
            points[0].x = 0;
            points[0].y = 0;
            points[1].x = this.game.width;
            points[1].y = 0;
            points[2].x = this.game.width / 2;
            points[2].y = this.game.height;
            // set fill color to red in HEX form.  The following is equal to 256 red, 0 green and 0 blue.  
            // Do at 50 % alpha, meaning half transparent
            graphics.beginFill(0xff0000, 0.5);
            // Finally draw the triangle, false indicates not to cull ( remove unseen values )
            graphics.drawTriangle(points, false);
            // Now change colour to green and 100% opacity/alpha
            graphics.beginFill(0x00ff00, 1.0);
            // Draw circle about screen's center, with 200 pixels radius
            graphics.drawCircle(this.game.width / 2, this.game.height / 2, 200);
        };
        GameRunningState.prototype.update = function () {
        };
        GameRunningState.prototype.render = function () {
        };
        return GameRunningState;
    }(Phaser.State));
    GameFromScratch.GameRunningState = GameRunningState;
    var SimpleGame = /** @class */ (function () {
        function SimpleGame() {
            this.game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, 'canvasholder');
            this.game.state.add("GameRunningState", GameRunningState, false);
            this.game.state.add("TitleScreenState", TitleScreenState, false);
            this.game.state.start("TitleScreenState", true, true);
        }
        return SimpleGame;
    }());
    GameFromScratch.SimpleGame = SimpleGame;
})(GameFromScratch || (GameFromScratch = {}));
window.onload = function () {
    var game = new GameFromScratch.SimpleGame();
};
//# sourceMappingURL=app.js.map