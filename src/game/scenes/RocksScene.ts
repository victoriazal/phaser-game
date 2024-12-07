export default class RocksScene extends Phaser.Scene {
    private selectedCharacter: string | null = null;
    private player: Phaser.Physics.Matter.Sprite | null = null;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
    private livesText: Phaser.GameObjects.Text | null = null;
    private timerText: Phaser.GameObjects.Text | null = null;
    private resultText: Phaser.GameObjects.Text | null = null;
    private restartButton: Phaser.GameObjects.Text | null = null;
    private lives: number = 3;
    private timer: number = 60; // 1 minute timer
    private gameOver: boolean = false;
    private rocks: Phaser.Physics.Matter.Image[] = [];

    constructor() {
        super({ key: "RocksScene" });
    }

    preload() {
        for (let i = 1; i <= 3; i++) {
            this.load.spritesheet(
                `character${i}`,
                `/assets/characters/character${i}.png`,
                {
                    frameWidth: 64,
                    frameHeight: 64,
                }
            );
        }
        this.load.image("sky", "/assets/skyBg.png");
        this.load.image("rock", "/assets/rock.png");
    }

    create(): void {
        // Set gravity to a positive value to make rocks fall
        this.matter.world.setGravity(0, 1);
        // Retrieve the selected character from the registry
        this.selectedCharacter = this.registry.get("selectedCharacter");
        if (!this.selectedCharacter) {
            console.error("No character selected");
            return;
        }

        // Add the sky background and make it fill the whole screen
        const sky = this.add.tileSprite(
            0,
            0,
            this.scale.width,
            this.scale.height,
            "sky"
        );
        sky.setOrigin(0, 0); // Set origin to the top-left corner
        sky.setDisplaySize(this.scale.width, this.scale.height); // Scale to fit the screen
        
        // Add the player character using Matter.js
        this.player = this.matter.add.sprite(
            this.scale.width / 2,
            this.scale.height - 64,
            this.selectedCharacter
        );
        this.player.setScale(2); // Scale down the character
        this.player.setFixedRotation(); // Prevent the character from rotating
        this.player.setIgnoreGravity(true); // Prevent the character from falling
        this.player.setOnCollide(() => {
            this.handlePlayerHit();
        } );
        this.player.setBounce(0)
        // Set up keyboard controls
        this.cursors = this.input?.keyboard?.createCursorKeys() || null;

        // Add lives text
        this.livesText = this.add.text(30, 16, `Lives: ${this.lives}`, {
            fontSize: "32px",
            color: "#ffffff",
        });

        // Add timer text
        this.timerText = this.add.text(
            this.scale.width - 200,
            16,
            `Time: ${this.timer}`,
            { fontSize: "32px", color: "#ffffff" }
        );

        // Add result text
        this.resultText = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2,
            "",
            { fontSize: "64px", color: "#ffffff" }
        );
        this.resultText.setOrigin(0.5);
        this.resultText.setVisible(false);

        // Add restart button
        this.restartButton = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2 + 100,
            "Restart",
            { fontSize: "32px", color: "#ffffff" }
        );
        this.restartButton.setOrigin(0.5);
        this.restartButton.setInteractive({ cursor: "pointer" });
        this.restartButton.setVisible(false);
        this.restartButton.on('pointerdown', () => {
            this.scene.restart();
            this.resetGame();
        });

        // Spawn rocks
        this.time.addEvent({
            delay: 1000,
            callback: this.spawnRock,
            callbackScope: this,
            loop: true,
        });

        // Timer event
        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true,
        });
    }

    update(time: number, delta: number): void {
        
        if (!this.player) {
            return;
        }

        const speed = 5;
        let moving = false;
        this.player.setVelocity(0);

        if (this.cursors?.left.isDown) {
            this.player.setVelocityX(-speed);
            this.player.anims.play("walk-left", true);
            moving = true;
        } else if (this.cursors?.right.isDown) {
            this.player.setVelocityX(speed);
            this.player.anims.play("walk-right", true);
            moving = true;
        }

        if (!moving) {
            this.player.anims.stop();
        }

 // Prevent the player from going outside the bounds
 if (this.player.x < 0) {
    this.player.setPosition(0, this.player.y);
} else if (this.player.x > this.scale.width) {
    this.player.setPosition(this.scale.width, this.player.y);
}
if (this.player.y < 0) {
    this.player.setPosition(this.player.x, 0);
} else if (this.player.y > this.scale.height-64) {
    this.player.setPosition(this.player.x, this.scale.height-64);
}
        this.rocks = this.rocks.filter((rock) => {
            if (rock.y > this.scale.height) {
                rock.destroy();
                return false;
            }
            return true;
        });
    }

    spawnRock() {
        if (this.gameOver) {
            return;
        }

        const x = Phaser.Math.Between(0, this.scale.width);
        const rock = this.matter.add.image(x, 0, "rock");
        rock.setBounce(1);
        rock.setScale(0.5);
        rock.setVelocityY(Phaser.Math.Between(2, 5));
        rock.setFrictionAir(0.1);
        this.rocks.push(rock);
    }

    updateTimer() {
        if (this.gameOver) {
            return;
        }

        this.timer--;
        this.timerText?.setText(`Time: ${this.timer}`);

        if (this.timer <= 0) {
            this.gameOver = true;
            this.rocks = [];
            this.resultText?.setText("Victory");
            this.resultText?.setVisible(true);
            this.restartButton?.setVisible(true);
        }
    }

    handlePlayerHit() {
        if (this.gameOver) {
            return;
        }
        if (!this.player) return;
        if (this.player.x < this.scale.width || this.player.y > this.scale.height) {
            this.player.setPosition(this.scale.width/2, this.scale.height-64);
        }
        this.time.addEvent({
            delay: 300, // Blink every 300ms
            repeat: 5,  // Blink 6 times (3 seconds total)
            callback: () => {
                this.player?.thrustRight(0.1);
                this.player?.setTintFill(0xff0000); // Set #a81d1dab tint
                this.time.delayedCall(150, () => {
                    this.player?.clearTint(); // Clear tint after 150ms
                });
            }
        });
        this.lives--;
        this.livesText?.setText(`Lives: ${this.lives}`);

        if (this.lives <= 0) {
            this.gameOver = true;
            this.resultText?.setText("Defeat");
            this.resultText?.setVisible(true);
            this.restartButton?.setVisible(true);
        }
    }
    resetGame() {
        this.gameOver = false;
        this.lives = 3;
        this.timer = 60;
        this.rocks.forEach(rock => rock.destroy());
        this.rocks = [];
    }
}

