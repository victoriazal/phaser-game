import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
    private selectedCharacter: string | null = null;
    private player: Phaser.Physics.Matter.Sprite | null = null;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
    private wasdKeys: { [key: string]: Phaser.Input.Keyboard.Key } | null =
        null;
    private xKey: Phaser.Input.Keyboard.Key | null = null;
    private pressText: Phaser.GameObjects.Text | null = null;
    private touchingGameBoy: boolean = false;

    constructor() {
        super({ key: "GameScene" });
    }

    preload() {
        // Load character sprite sheets
        for (let i = 1; i <= 3; i++) {
            this.load.spritesheet(
                `character${i}`,
                `/assets/characters/character${i}.png`,
                {
                    frameWidth: 64, // Width of each frame
                    frameHeight: 64, // Height of each frame
                }
            );
        }
        // Load object images
        this.load.image("tree", "/assets/tree.png");
        this.load.image("tree2", "/assets/tree2.png");
        this.load.image("gameBoy", "/assets/gameBoy.png");
        this.load.image("grassBg", "/assets/grassBg.png"); // Load grass background image
    }

    create() {
        const grassBg = this.add.image(0, 0, "grassBg");
        grassBg.setOrigin(0, 0); // Set origin to the top-left corner
        grassBg.setDisplaySize(2000, 2000); // Scale to fit the screen
    
        // Set gravity to zero
        this.matter.world.setGravity(0, 0);
    

        // Add static objects
        const objects = [
            { key: "gameBoy", x: 1000, y: 1000, scale: 1.5 },
        ];

        objects.forEach((obj) => {
            const staticObj = this.matter.add.image(
                obj.x,
                obj.y,
                obj.key,
                undefined,
                { isStatic: true }
            );
            staticObj.setScale(obj.scale);
        });

        // Set world bounds to match the area covered by objects
        this.matter.world.setBounds(0, 0, 2000, 2000);

        // Get the selected character from the registry
        this.selectedCharacter = this.registry.get("selectedCharacter");
        if (!this.selectedCharacter) {
            console.error("No character selected");
            return;
        }

        this.anims.create({
            key: "walk-down",
            frames: this.anims.generateFrameNumbers(this.selectedCharacter, {
                start: 0,
                end: 3,
            }), 
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "walk-left",
            frames: this.anims.generateFrameNumbers(this.selectedCharacter, {
                start: 4,
                end: 7,
            }), 
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "walk-right",
            frames: this.anims.generateFrameNumbers(this.selectedCharacter, {
                start: 8,
                end: 11,
            }), 
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "walk-up",
            frames: this.anims.generateFrameNumbers(this.selectedCharacter, {
                start: 12,
                end: 15,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.player = this.matter.add.sprite(600, 700, this.selectedCharacter);
        this.player.setScale(2.2); 
        this.player.setFixedRotation(); 

        // Set up keyboard controls
        this.cursors = this.input?.keyboard?.createCursorKeys() || null;
        this.wasdKeys = {
            W: this.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W)!,
            A: this.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A)!,
            S: this.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S)!,
            D: this.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D)!,
        };
        if (this.input?.keyboard) {
            this.xKey = this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.X
            );
        }

        // Set camera to follow the player
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, 2000, 2000); // Ensure camera bounds match the world bounds

        // Add "Press X" text indicator
        this.pressText = this.add.text(
            this.player.x,
            this.player.y - 50,
            "Press X",
            { fontSize: "20px", color: "#ffffff" }
        );
        this.pressText.setOrigin(0.5);
        this.pressText.setVisible(false);

       this.player.setOnCollide(() => {
        this.touchingGameBoy = true;
        this.pressText?.setVisible(true);
    } );

        this.matter.world.on("collisionend", (event: any) => {
            event.pairs.forEach((pair: any) => {
                const { bodyA, bodyB } = pair;
                if (
                    (bodyA.gameObject === this.player &&
                        bodyB.gameObject?.texture.key === "gameBoy") ||
                    (bodyB.gameObject === this.player &&
                        bodyA.gameObject?.texture.key === "gameBoy")
                ) {
                    this.touchingGameBoy = false;
                    this.pressText?.setVisible(false);
                }
            });
        });
    }

    update(time: number, delta: number): void {
        if (!this.player) {
            return;
        }

        const speed = 5;
        let moving = false;

        // Reset player velocity
        this.player.setVelocity(0);

        // Move player with arrow keys
        if (this.cursors?.left.isDown) {
            this.player.setVelocityX(-speed);
            this.player.anims.play("walk-left", true);
            moving = true;
        } else if (this.cursors?.right.isDown) {
            this.player.setVelocityX(speed);
            this.player.anims.play("walk-right", true);
            moving = true;
        } else if (this.cursors?.up.isDown) {
            this.player.setVelocityY(-speed);
            this.player.anims.play("walk-up", true);
            moving = true;
        } else if (this.cursors?.down.isDown) {
            this.player.setVelocityY(speed);
            this.player.anims.play("walk-down", true);
            moving = true;
        }

        // Move player with WASD keys
        if (this.wasdKeys?.A.isDown) {
            this.player.setVelocityX(-speed);
            this.player.anims.play("walk-left", true);
            moving = true;
        } else if (this.wasdKeys?.D.isDown) {
            this.player.setVelocityX(speed);
            this.player.anims.play("walk-right", true);
            moving = true;
        } else if (this.wasdKeys?.W.isDown) {
            this.player.setVelocityY(-speed);
            this.player.anims.play("walk-up", true);
            moving = true;
        } else if (this.wasdKeys?.S.isDown) {
            this.player.setVelocityY(speed);
            this.player.anims.play("walk-down", true);
            moving = true;
        }

        // Stop animation if not moving
        if (!moving) {
            this.player.anims.stop();
            console.log("Stopping animation");
        }

        // Update "Press X" text position
        if (this.pressText) {
            this.pressText.setPosition(this.player.x, this.player.y - 50);
        }

        // Check for "X" key press and transition to the next scene
        if (
            this.touchingGameBoy &&
            Phaser.Input.Keyboard.JustDown(this.xKey!)
        ) {
            this.registry.set("selectedCharacter", this.selectedCharacter); // Store the selected character again
            this.scene.start("RocksScene"); // Replace 'RocksScene' with the actual key of your third scene
        }
    }
}
