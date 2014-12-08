game.resources = [

	/* Graphics. 
	 * @example
	 * {name: "example", type:"image", src: "data/img/example.png"},
	 */
        
        //loading up images from img folder or url
         {name: "background-tiles", type: "image", src: "data/img/background-tiles.png"},
         {name: "meta-tiles", type: "image", src: "data/img/meta-tiles.png"},
         {name: "mario", type:"image", src: "data/img/player1.png"},
	 {name: "title-screen", type:"image", src: "data/img/title-screen.png"},
	 {name: "slime", type:"image", src: "data/img/skeleton.png"},
	 {name: "mushroom", type:"image", src: "data/img/mushroom.png"},
	 {name: "star", type:"image", src: "data/img/star.png"},
         {name: "flower", type:"image", src: "data/img/flower.png"},
	 {name: "gameover-screen", type:"image", src: "http://catandwhip.files.wordpress.com/2009/01/black_screen.jpg"},
	
	/* Atlases 
	 * @example
	 * {name: "example_tps", type: "tps", src: "data/img/example_tps.json"},
	 */
		
	/* Maps. 
	 * @example
	 * {name: "example01", type: "tmx", src: "data/map/example01.tmx"},
	 * {name: "example01", type: "tmx", src: "data/map/example01.json"},
 	 */
        //loading up maps
        {name: "ChongLevel01", type: "tmx", src: "data/map/ChongLevel01.tmx"},
        {name: "ChongLevel02", type: "tmx", src: "data/map/ChongLevel02.tmx"},

	/* Background music. 
	 * @example
	 * {name: "example_bgm", type: "audio", src: "data/bgm/"},
	 */	

	/* Sound effects. 
	 * @example
	 * {name: "example_sfx", type: "audio", src: "data/sfx/"}
	 */
];
