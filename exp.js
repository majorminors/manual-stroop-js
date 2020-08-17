
		////////////
		/* set up */
		////////////

		var instructions_on = 1; // you can turn off (0) the first few blocks of instructions if you want to test

		var num_blocks = 2; // will repeat each block of stimuli this number of times (blocked together)
		var num_tr_blocks = 1; // number of training blocks (same principle as num_blocks)
	
		var stim_width = { // stimulus width in pixels - height is auto (i.e. will maintain aspect ratio)
			small: 100,
			medium: 500,
			large: 1000
		} 

		var resp_options = [
			{
				resp_keys: ['a','s','d'],
				condition: ['asd',1],
			},
			{
				resp_keys: ['a','d','s'],
				condition: ['ads',2],
			},	
			{
				resp_keys: ['s','d','a'],
				condition: ['sda',3],
			},	
			{
				resp_keys: ['s','a','d'],
				condition: ['sad',4],
			},
			{
				resp_keys: ['d','a','s'],
				condition: ['das',5],
			},
			{
				resp_keys: ['d','s','a'],
				condition: ['dsa',6],
			}
		];

		var option_num = Math.floor(Math.random() * resp_options.length);
		var resp_keys = resp_options[option_num].resp_keys;
		var condition = resp_options[option_num].condition;
		console.log("option number: ",option_num);
		console.log("condition: ",condition)
		// we'll code red/small as resp_keys[0], blue/medium as resp_keys[1], and green/large as resp_keys[2]

		jsPsych.data.addProperties({
			condition: condition
		});

		var timeline = []; // initialise timeline
		
		//////////////////
		/* instructions */
		//////////////////	

		var instructions = {
			type: 'html-keyboard-response',
			stimulus:'<p>In this experiment you will be using buttons to respond to the images on the screen.<br>There are four different tasks.<br>At the start of each task, you will be provided with instructions.<br>This will be followed by a short training. During training you will be provided with feedback after each trial informing you of the correct answer so you can check.<br>After training, you will no longer receive feedback.<br>The buttons you will be using for this experiment are: </p>'+
				'<p>'+JSON.stringify(resp_keys[0])+', '+JSON.stringify(resp_keys[1])+', '+JSON.stringify(resp_keys[2])+'</p>'+
				'<br><p>press any key to continue</p>'
		}

		/* push those to the timeline, if instructions are on */
		if (instructions_on == 1) {
			timeline.push(instructions);
		}

		//////////////////////
		/* instruction bits */
		//////////////////////

		/* report size instructions */
		var size_instructions = {
			type: 'html-keyboard-response',
			stimulus: '<p>In this task, you must report the <em>size</em> of the image.<br>It will be either</p><br>'+
				'<p>small: '+JSON.stringify(resp_keys[0])+', medium: '+JSON.stringify(resp_keys[1])+', large: '+JSON.stringify(resp_keys[2])+'</p><br>'+
				'<br><p>Press any key to continue.</p>',
		}

		/* report colour instructions */
		var colour_instructions = {
			type: 'html-keyboard-response',
			stimulus: '<p>In this task, you must report the <em>colour</em> of the image.<br>It will be either</p><br>'+
				'<p>red: '+JSON.stringify(resp_keys[0])+', blue: '+JSON.stringify(resp_keys[1])+', green: '+JSON.stringify(resp_keys[2])+'</p><br>'+
				'<br><p>Press any key to continue.</p>',
		}

		/* pre item instructions */
		var pre_training = {
			type: 'html-keyboard-response',
			stimulus: 'We will start with a block of training, and we will give you feedback each trial.<br><br> Press any key to continue.</p>',
		}
		var pre_test = {
			type: 'html-keyboard-response',
			stimulus: 'Now we begin the test. You will no longer recieve feedback.<br><br> Press any key to continue.</p>',
		}

		//////////////////
		/* trial blocks */
		//////////////////

		/* feedback objects we can call later when we put together the procedure */
		size_feedback = {
			type: 'html-keyboard-response',
			stimulus: function(){
				var size_string = jsPsych.data.get().last(1).values()[0].size;
				return '<p> correct answer: '+JSON.stringify(size_string)+'</p>';
			},
			choices: jsPsych.NO_KEYS,
			trial_duration: 500,
		}
		colour_feedback = {
			type: 'html-keyboard-response',
			stimulus: function(){
				var colour_string = jsPsych.data.get().last(1).values()[0].colour;
				return '<p> correct answer: '+JSON.stringify(colour_string)+'</p>';
			},
			choices: jsPsych.NO_KEYS,
			trial_duration: 500,
		}

		/* stroop task */
		var stroop_task = {
			timeline: [
				{
					type: 'html-keyboard-response',
					stimulus: '<div style="font-size:60px;">+</div>',
					choices: jsPsych.NO_KEYS,
					trial_duration: 300
				},
				{
					type: 'image-keyboard-response',
					stimulus: jsPsych.timelineVariable('stim_path'),
					stimulus_width: jsPsych.timelineVariable('stim_size'),
					choices: resp_keys,
					on_finish: function(data){
						data.correct = data.key_press == jsPsych.pluginAPI.convertKeyCharacterToKeyCode(data.correct_response);
					},
					data: jsPsych.timelineVariable('add_data')
				}
			],
			timeline_variables: [
				{stim_path: 'stimuli/red-red.svg', stim_size: stim_width.small, add_data: {stimulus: 'red-red-small', size: 'small', colour: 'red'}},
				{stim_path: 'stimuli/red-red.svg', stim_size: stim_width.small, add_data: {stimulus: 'red-red-small', size: 'small', colour: 'red'}},
				{stim_path: 'stimuli/red-blue.svg', stim_size: stim_width.small, add_data: {stimulus: 'red-blue-small', size: 'small', colour: 'blue'}},
				{stim_path: 'stimuli/red-green.svg', stim_size: stim_width.small, add_data: {stimulus: 'red-green-small', size: 'small', colour: 'green'}},
				{stim_path: 'stimuli/blue-blue.svg', stim_size: stim_width.small, add_data: {stimulus: 'blue-blue-small', size: 'small', colour: 'blue'}},
				{stim_path: 'stimuli/blue-blue.svg', stim_size: stim_width.small, add_data: {stimulus: 'blue-blue-small', size: 'small', colour: 'blue'}},
				{stim_path: 'stimuli/blue-red.svg', stim_size: stim_width.small, add_data: {stimulus: 'blue-red-small', size: 'small', colour: 'red'}},
				{stim_path: 'stimuli/blue-green.svg', stim_size: stim_width.small, add_data: {stimulus: 'blue-green-small', size: 'small', colour: 'green'}},
				{stim_path: 'stimuli/green-green.svg', stim_size: stim_width.small, add_data: {stimulus: 'green-green-small', size: 'small', colour: 'green'}},
				{stim_path: 'stimuli/green-green.svg', stim_size: stim_width.small, add_data: {stimulus: 'green-green-small', size: 'small', colour: 'green'}},
				{stim_path: 'stimuli/green-red.svg', stim_size: stim_width.small, add_data: {stimulus: 'green-red-small', size: 'small', colour: 'red'}},
				{stim_path: 'stimuli/green-blue.svg', stim_size: stim_width.small, add_data: {stimulus: 'green-blue-small', size: 'small', colour: 'blue'}},
				{stim_path: 'stimuli/red-red.svg', stim_size: stim_width.medium, add_data: {stimulus: 'red-red-medium', size: 'medium', colour: 'red'}},
				{stim_path: 'stimuli/red-red.svg', stim_size: stim_width.medium, add_data: {stimulus: 'red-red-medium', size: 'medium', colour: 'red'}},
				{stim_path: 'stimuli/red-blue.svg', stim_size: stim_width.medium, add_data: {stimulus: 'red-blue-medium', size: 'medium', colour: 'blue'}},
				{stim_path: 'stimuli/red-green.svg', stim_size: stim_width.medium, add_data: {stimulus: 'red-green-medium', size: 'medium', colour: 'green'}},
				{stim_path: 'stimuli/blue-blue.svg', stim_size: stim_width.medium, add_data: {stimulus: 'blue-blue-medium', size: 'medium', colour: 'blue'}},
				{stim_path: 'stimuli/blue-blue.svg', stim_size: stim_width.medium, add_data: {stimulus: 'blue-blue-medium', size: 'medium', colour: 'blue'}},
				{stim_path: 'stimuli/blue-red.svg', stim_size: stim_width.medium, add_data: {stimulus: 'blue-red-medium', size: 'medium', colour: 'red'}},
				{stim_path: 'stimuli/blue-green.svg', stim_size: stim_width.medium, add_data: {stimulus: 'blue-green-medium', size: 'medium', colour: 'green'}},
				{stim_path: 'stimuli/green-green.svg', stim_size: stim_width.medium, add_data: {stimulus: 'green-green-medium', size: 'medium', colour: 'green'}},
				{stim_path: 'stimuli/green-green.svg', stim_size: stim_width.medium, add_data: {stimulus: 'green-green-medium', size: 'medium', colour: 'green'}},
				{stim_path: 'stimuli/green-red.svg', stim_size: stim_width.medium, add_data: {stimulus: 'green-red-medium', size: 'medium', colour: 'red'}},
				{stim_path: 'stimuli/green-blue.svg', stim_size: stim_width.medium, add_data: {stimulus: 'green-blue-medium', size: 'medium', colour: 'blue'}},
				{stim_path: 'stimuli/red-red.svg', stim_size: stim_width.large, add_data: {stimulus: 'red-red-large', size: 'large', colour: 'red'}},
				{stim_path: 'stimuli/red-red.svg', stim_size: stim_width.large, add_data: {stimulus: 'red-red-large', size: 'large', colour: 'red'}},
				{stim_path: 'stimuli/red-blue.svg', stim_size: stim_width.large, add_data: {stimulus: 'red-blue-large', size: 'large', colour: 'blue'}},
				{stim_path: 'stimuli/red-green.svg', stim_size: stim_width.large, add_data: {stimulus: 'red-green-large', size: 'large', colour: 'green'}},
				{stim_path: 'stimuli/blue-blue.svg', stim_size: stim_width.large, add_data: {stimulus: 'blue-blue-large', size: 'large', colour: 'blue'}},
				{stim_path: 'stimuli/blue-blue.svg', stim_size: stim_width.large, add_data: {stimulus: 'blue-blue-large', size: 'large', colour: 'blue'}},
				{stim_path: 'stimuli/blue-red.svg', stim_size: stim_width.large, add_data: {stimulus: 'blue-red-large', size: 'large', colour: 'red'}},
				{stim_path: 'stimuli/blue-green.svg', stim_size: stim_width.large, add_data: {stimulus: 'blue-green-large', size: 'large', colour: 'green'}},
				{stim_path: 'stimuli/green-green.svg', stim_size: stim_width.large, add_data: {stimulus: 'green-green-large', size: 'large', colour: 'green'}},
				{stim_path: 'stimuli/green-green.svg', stim_size: stim_width.large, add_data: {stimulus: 'green-green-large', size: 'large', colour: 'green'}},
				{stim_path: 'stimuli/green-red.svg', stim_size: stim_width.large, add_data: {stimulus: 'green-red-large', size: 'large', colour: 'red'}},
				{stim_path: 'stimuli/green-blue.svg', stim_size: stim_width.large, add_data: {stimulus: 'green-blue-large', size: 'large', colour: 'blue'}}, 
			],
			randomize_order: true,
			// 'repetitions:' would go here, but we will assign this more dynamically later
		}

		/* false font task */
		var false_font_task = {
			timeline: [
				{
					type: 'html-keyboard-response',
					stimulus: '<div style="font-size:60px;">+</div>',
					choices: jsPsych.NO_KEYS,
					trial_duration: 300
				},
				{
					type: 'image-keyboard-response',
					stimulus: jsPsych.timelineVariable('stim_path'),
					stimulus_width: jsPsych.timelineVariable('stim_size'),
					choices: resp_keys,
					on_finish: function(data){
						data.correct = data.key_press == jsPsych.pluginAPI.convertKeyCharacterToKeyCode(data.correct_response);
					},
					data: jsPsych.timelineVariable('add_data')
				}
			],
			timeline_variables: [
				{stim_path: 'stimuli/ffred-red.svg', stim_size: stim_width.small, add_data: {stimulus: 'ffred-red-small', size: 'small', colour: 'red'}},
				{stim_path: 'stimuli/ffred-red.svg', stim_size: stim_width.small, add_data: {stimulus: 'ffred-red-small', size: 'small', colour: 'red'}},
				{stim_path: 'stimuli/ffred-blue.svg', stim_size: stim_width.small, add_data: {stimulus: 'ffred-blue-small', size: 'small', colour: 'blue'}},
				{stim_path: 'stimuli/ffred-green.svg', stim_size: stim_width.small, add_data: {stimulus: 'ffred-green-small', size: 'small', colour: 'green'}},
				{stim_path: 'stimuli/ffblue-blue.svg', stim_size: stim_width.small, add_data: {stimulus: 'ffblue-blue-small', size: 'small', colour: 'blue'}},
				{stim_path: 'stimuli/ffblue-blue.svg', stim_size: stim_width.small, add_data: {stimulus: 'ffblue-blue-small', size: 'small', colour: 'blue'}},
				{stim_path: 'stimuli/ffblue-red.svg', stim_size: stim_width.small, add_data: {stimulus: 'ffblue-red-small', size: 'small', colour: 'red'}},
				{stim_path: 'stimuli/ffblue-green.svg', stim_size: stim_width.small, add_data: {stimulus: 'ffblue-green-small', size: 'small', colour: 'green'}},
				{stim_path: 'stimuli/ffgreen-green.svg', stim_size: stim_width.small, add_data: {stimulus: 'ffgreen-green-small', size: 'small', colour: 'green'}},
				{stim_path: 'stimuli/ffgreen-green.svg', stim_size: stim_width.small, add_data: {stimulus: 'ffgreen-green-small', size: 'small', colour: 'green'}},
				{stim_path: 'stimuli/ffgreen-red.svg', stim_size: stim_width.small, add_data: {stimulus: 'ffgreen-red-small', size: 'small', colour: 'red'}},
				{stim_path: 'stimuli/ffgreen-blue.svg', stim_size: stim_width.small, add_data: {stimulus: 'ffgreen-blue-small', size: 'small', colour: 'blue'}},
				{stim_path: 'stimuli/ffred-red.svg', stim_size: stim_width.medium, add_data: {stimulus: 'ffred-red-medium', size: 'medium', colour: 'red'}},
				{stim_path: 'stimuli/ffred-red.svg', stim_size: stim_width.medium, add_data: {stimulus: 'ffred-red-medium', size: 'medium', colour: 'red'}},
				{stim_path: 'stimuli/ffred-blue.svg', stim_size: stim_width.medium, add_data: {stimulus: 'ffred-blue-medium', size: 'medium', colour: 'blue'}},
				{stim_path: 'stimuli/ffred-green.svg', stim_size: stim_width.medium, add_data: {stimulus: 'ffred-green-medium', size: 'medium', colour: 'green'}},
				{stim_path: 'stimuli/ffblue-blue.svg', stim_size: stim_width.medium, add_data: {stimulus: 'ffblue-blue-medium', size: 'medium', colour: 'blue'}},
				{stim_path: 'stimuli/ffblue-blue.svg', stim_size: stim_width.medium, add_data: {stimulus: 'ffblue-blue-medium', size: 'medium', colour: 'blue'}},
				{stim_path: 'stimuli/ffblue-red.svg', stim_size: stim_width.medium, add_data: {stimulus: 'ffblue-red-medium', size: 'medium', colour: 'red'}},
				{stim_path: 'stimuli/ffblue-green.svg', stim_size: stim_width.medium, add_data: {stimulus: 'ffblue-green-medium', size: 'medium', colour: 'green'}},
				{stim_path: 'stimuli/ffgreen-green.svg', stim_size: stim_width.medium, add_data: {stimulus: 'ffgreen-green-medium', size: 'medium', colour: 'green'}},
				{stim_path: 'stimuli/ffgreen-green.svg', stim_size: stim_width.medium, add_data: {stimulus: 'ffgreen-green-medium', size: 'medium', colour: 'green'}},
				{stim_path: 'stimuli/ffgreen-red.svg', stim_size: stim_width.medium, add_data: {stimulus: 'ffgreen-red-medium', size: 'medium', colour: 'red'}},
				{stim_path: 'stimuli/ffgreen-blue.svg', stim_size: stim_width.medium, add_data: {stimulus: 'ffgreen-blue-medium', size: 'medium', colour: 'blue'}},
				{stim_path: 'stimuli/ffred-red.svg', stim_size: stim_width.large, add_data: {stimulus: 'ffred-red-large', size: 'large', colour: 'red'}},
				{stim_path: 'stimuli/ffred-red.svg', stim_size: stim_width.large, add_data: {stimulus: 'ffred-red-large', size: 'large', colour: 'red'}},
				{stim_path: 'stimuli/ffred-blue.svg', stim_size: stim_width.large, add_data: {stimulus: 'ffred-blue-large', size: 'large', colour: 'blue'}},
				{stim_path: 'stimuli/ffred-green.svg', stim_size: stim_width.large, add_data: {stimulus: 'ffred-green-large', size: 'large', colour: 'green'}},
				{stim_path: 'stimuli/ffblue-blue.svg', stim_size: stim_width.large, add_data: {stimulus: 'ffblue-blue-large', size: 'large', colour: 'blue'}},
				{stim_path: 'stimuli/ffblue-blue.svg', stim_size: stim_width.large, add_data: {stimulus: 'ffblue-blue-large', size: 'large', colour: 'blue'}},
				{stim_path: 'stimuli/ffblue-red.svg', stim_size: stim_width.large, add_data: {stimulus: 'ffblue-red-large', size: 'large', colour: 'red'}},
				{stim_path: 'stimuli/ffblue-green.svg', stim_size: stim_width.large, add_data: {stimulus: 'ffblue-green-large', size: 'large', colour: 'green'}},
				{stim_path: 'stimuli/ffgreen-green.svg', stim_size: stim_width.large, add_data: {stimulus: 'ffgreen-green-large', size: 'large', colour: 'green'}},
				{stim_path: 'stimuli/ffgreen-green.svg', stim_size: stim_width.large, add_data: {stimulus: 'ffgreen-green-large', size: 'large', colour: 'green'}},
				{stim_path: 'stimuli/ffgreen-red.svg', stim_size: stim_width.large, add_data: {stimulus: 'ffgreen-red-large', size: 'large', colour: 'red'}},
				{stim_path: 'stimuli/ffgreen-blue.svg', stim_size: stim_width.large, add_data: {stimulus: 'ffgreen-blue-large', size: 'large', colour: 'blue'}},
			],
			randomize_order: true,
			// 'repetitions:' would go here, but we will assign this more dynamically later
		}

		//////////////////////////////////////////////////////
		/* grab all the image paths, so we can preload them */
		//////////////////////////////////////////////////////
  
		var stroop_image_paths = []; // init the variable
		for (i = 0; i < stroop_task.timeline_variables.length; i++) {
			stroop_image_paths[i] = stroop_task.timeline_variables[i].stim_path;
		}
		var falsefont_image_paths = []; // init the variable
		for (i = 0; i < false_font_task.timeline_variables.length; i++) {
			falsefont_image_paths[i] = false_font_task.timeline_variables[i].stim_path;
		}

		////////////////////////
		/* procedure creation */
		////////////////////////
		
		var stroop_colour_proc = [
			colour_instructions,
			pre_training,
			{...stroop_task, timeline: [stroop_task.timeline[0], stroop_task.timeline[1], colour_feedback], repetitions: num_tr_blocks},
			pre_test, {...stroop_task, repetitions: num_blocks}
		]; // precede stroop with colour instructions
		
		var stroop_size_proc = [
			size_instructions,
			pre_training,
			{...stroop_task, timeline: [stroop_task.timeline[0], stroop_task.timeline[1], size_feedback], repetitions: num_tr_blocks},
			pre_test,
			{...stroop_task, repetitions: num_blocks}
		]; // precede stroop with size instructions

		var falsefont_colour_proc = [
			colour_instructions,
			pre_training,
			{...false_font_task, timeline: [false_font_task.timeline[0], false_font_task.timeline[1], colour_feedback], repetitions: num_tr_blocks},
			pre_test,
			{...false_font_task, repetitions: num_blocks}
		]; // precede false fonts with colour instructions

		var falsefont_size_proc = [
			size_instructions,
			pre_training,
			{...false_font_task, timeline: [false_font_task.timeline[0], false_font_task.timeline[1], size_feedback], repetitions: num_tr_blocks},
			pre_test,
			{...false_font_task, repetitions: num_blocks}
		]; // precede false fonts with colour instructions
		
		var unshuffled_procedure = [stroop_colour_proc, stroop_size_proc, falsefont_colour_proc, falsefont_size_proc]; // place all into a single array

		function shuffle(array) { // fisher-yates shuffler function
			var m = array.length, t, i;

			// While there remain elements to shuffle…
			while (m) {

				// Pick a remaining element…
				i = Math.floor(Math.random() * m--);

				// And swap it with the current element.
				t = array[m];
				array[m] = array[i];
				array[i] = t;
			}

			return array;
		}

		var shuffled_procedure = shuffle(unshuffled_procedure).flat(); // shuffle the procedure, and flatten it into one layer
		
		for (i = 0; i < shuffled_procedure.length; i++) { // loop through the shuffled and flattened procedure array, and push each jsPsych trial block to the timeline
			timeline.push(shuffled_procedure[i]);
		}

		/* individual blocks for testing */ 
		//timeline.push(size_instructions);
		//timeline.push(colour_instructions);
		//timeline.push(stroop_task);
		//timeline.push(false_font_task);
