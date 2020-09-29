
        ////////////
        /* set up */
        ////////////

        var instructions_on = 1; // you can turn off (0) the first block of instructions if you want to test

        var num_blocks = 2; // will repeat each block of stimuli this number of times (blocked together)
        var num_tr_blocks = 1; // number of training blocks (same principle as num_blocks)

        var participant_id = jsPsych.randomization.randomID(15); // generate a string for participant ID
        jsPsych.data.addProperties({ // push that to the data object
          participant: participant_id
        });
        ///////////////////
        /* response keys */
        ///////////////////

        // 1 = 49, 2 = 50, 3 = 51, Numpad1 = 97, Numpad2 = 98, Numpad3 = 99
        var resp_keys = ['1','2','3',97,98,99];
        var resp_coding = {
            short: [resp_keys[0],resp_keys[3]],
            medium: [resp_keys[1],resp_keys[4]],
            tall: [resp_keys[2],resp_keys[5]],
            red: [resp_keys[0],resp_keys[3]],
            blue: [resp_keys[1],resp_keys[4]],
            green: [resp_keys[2],resp_keys[5]]
        }
        var resp_feedback = {
            short: resp_keys[0],
            medium: resp_keys[1],
            tall: resp_keys[2],
            red: resp_keys[0],
            blue: resp_keys[1],
            green: resp_keys[2]
        }
        jsPsych.data.addProperties({ // push that to the data object
          response_mapping: resp_coding
        });

        //////////////////////
        /* stimuli creation */
        //////////////////////

        var colours = ["red", "blue", "green"];

        var window_height = window.innerHeight; // get the window height in pixels	
        var stim_height = { // stimulus height in pixels - width is auto (i.e. will maintain aspect ratio)
            short: window_height*0.1,
            medium: window_height*0.3,
            tall: window_height*0.5
        }

        // little stimulus factory we'll use later when constructing the trials
        // produces a complete stimulus object that can be indexed into by a trial variablec as a timeline variable.
        function stimulusFactory(colour, print, size){
            var stim_path = `stimuli/${print}-${colour}.svg`;
            var stim_size = stim_height[size];
            var trn_stim = `stimuli/${colour}.svg`;
            var congruency;
            if (print.includes(colour)) {
                congruency = 'congruent';
            } else {
                congruency = 'incongruent';
            }
            return {
                stim_path,
                stim_size,
                trn_stim,
                add_data: {
                    colour,
                    print,
                    size,
                    congruency,
                }
            }
        }

        // create a little factory to put together a stimulus list for the timeline variable
        // will produce a list of calls to the stimulusFactory
        // don't have to use this--can just call stimulus factory directly however many times like:
        //          timeline_variables: [
        //              stimulusFactory("green", "red", "short"),
        //              stimulusFactory("green", "blue", "short"),
        //              ...
        //          ]
        function stimListFactory(colours, doFalseFont, sizes) {
            let stimulus_list = [];
        
            let printed_words = [...colours]
            // in this case, the print is the same as the colours (or based off the colours in the case of the false fonts)
            // with different printed words, just replace 'doFalseFont' with prints and replace the references to `final_print`
        
            colours.forEach(colour => {
                // console.log('Ink colour: ' + colour)
        
                sizes.forEach(size => {
                    // console.log('Size: ' + size)
        
                    printed_words.forEach(print => {
                        // console.log('Print Colour: ' + print)
        
                        let final_print = doFalseFont ? ('ff' + print) : print
                        // if doFalseFont is true, append 'ff' to print, else just pass print
        
                        if(colour === print) {
                            // produce calls to create two of any congruent stimuli
                            stimulus_list.push(stimulusFactory(colour, final_print, size))
                            stimulus_list.push(stimulusFactory(colour, final_print, size))
                        } else {
                            // produce calls to create one of each incongruent stimulus type
                            stimulus_list.push(stimulusFactory(colour, final_print, size))
                        }
                    });
                });
            });
        
            return stimulus_list;
        } 

        var timeline = []; // initialise timeline

        //////////////////////////////////
        /* do window and viewport stuff */
        //////////////////////////////////

        var screen_dimensions = { //get screen and viewport dimensions
            type: 'call-function',
            func: function(){
                var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],viewx=w.innerWidth||e.clientWidth||g.clientWidth,viewy=w.innerHeight||e.clientHeight||g.clientHeight; // lots of shorcuts, but essentially just get some javascript height and width descriptors
                var dpcm=function(){
                    // calc display pixels per cm
                    const el = document.createElement('div'); // create a div
                    el.style = 'width: 1cm;' // make it one cm wide
                    document.body.appendChild(el); // add it as a child of the body
                    const dpcm = el.offsetWidth; // measure the pixels of the css width and save that
                    document.body.removeChild(el); // remove it as a child of the body
                    return dpcm; // return the pixels per cm
                }
                var width_cm = viewx/dpcm;
                var height_cm = viewy/dpcm;
                jsPsych.data.getLastTrialData().addToAll({ // add screen and viewport info to the resize trial data. that way, all sz info is together
                    screen_width_px: screen.width,
                    screen_height_px: screen.height, 
                    viewport_width_px: viewx,
                    viewport_height_px: viewy,
                    px_per_cm: dpcm,
                    viewport_width_cm: width_cm,
                    viewport_height_cm: height_cm,
                })
            },
        }
        timeline.push(screen_dimensions);        

        // standardise the screen size
        // var screen_sizer = {
        //     type: 'resize',
        //     item_width: 3 + 3/8,
        //     item_height: 2 + 1/8,
        //     prompt: "<p>Click and drag the lower right corner of the box until the box is the same size as a credit card held up to the screen.</p>",
        //     pixels_per_unit: 150
        // }
        // timeline.push(screen_sizer);

        //////////////////////
        /* instruction bits */
        //////////////////////

        var instructions_onstart = {
            type: 'html-keyboard-response',
            stimulus:"<p>In this experiment you'll see images on the screen and respond by pressing buttons<br>There are four different tasks in this experiment.<br>Each one is slightly different, although all are similar.<br>At the start of each task, you'll get some instructions.<br>Then there will be a short 'training' period during which we'll tell you the correct answer after each trial.<br>Then you'll start the block properly and you won't get any feedback until the next block.<br><br><br>When ready, press any key continue.</p>"
        }

        var button_instructions = {
            type: 'html-keyboard-response',
            stimulus:'<p>The buttons for this experiment will always be: </p>'+
                '<p>'+JSON.stringify(resp_keys[0])+', '+JSON.stringify(resp_keys[1])+', '+JSON.stringify(resp_keys[2])+'</p>'+
                'Feel free to use either hand, but you must use this hand throughout the experiment<br><p>Press any key to continue</p>'
        }

        /* push those to the timeline, if instructions are on */
        if (instructions_on == 1) {
            timeline.push(instructions_onstart);
            timeline.push(button_instructions);
        }


        /* report size instructions */
        var size_instructions = {
            type: 'html-keyboard-response',
            stimulus: '<p>In this version of the task, you must report the <em>height</em> of the image by pressing a button.<br>It will be either</p><br>'+
                '<p>short: '+JSON.stringify(resp_keys[0])+', medium: '+JSON.stringify(resp_keys[1])+', tall: '+JSON.stringify(resp_keys[2])+'</p><br>'+
                '<p>Please keep your eyes on the centre of the screen throughout.</p><br>'+
                '<br><p>Press any key to continue.</p>',
        }
        var size_instruction_reminder = {
            type: 'html-keyboard-response',
            stimulus: '<p>Remember, you must report the <em>height</em> of the image which will be either</p><br>'+
                '<p>short: '+JSON.stringify(resp_keys[0])+', medium: '+JSON.stringify(resp_keys[1])+', tall: '+JSON.stringify(resp_keys[2])+'</p><br>'+
                '<p>Please keep your eyes on the centre of the screen throughout.</p><br>'+
                '<br><p>Press any key to continue.</p>',
        }

        /* report colour instructions */
        var colour_instructions = {
            type: 'html-keyboard-response',
            stimulus: '<p>In this version of the task, you must report the <em>colour</em> of the image by pressing a button.<br>It will be either</p><br>'+
                '<p>red: '+JSON.stringify(resp_keys[0])+', blue: '+JSON.stringify(resp_keys[1])+', green: '+JSON.stringify(resp_keys[2])+'</p><br>'+
                '<p>Please keep your eyes on the centre of the screen throughout.</p><br>'+
                '<br><p>Press any key to continue.</p>',
        }
        var colour_instruction_reminder = {
            type: 'html-keyboard-response',
            stimulus: '<p>Remember, you must report the <em>size</em> of the image which will be either</p><br>'+
                '<p>red: '+JSON.stringify(resp_keys[0])+', blue: '+JSON.stringify(resp_keys[1])+', green: '+JSON.stringify(resp_keys[2])+'</p><br>'+
                '<p>Please keep your eyes on the centre of the screen throughout.</p><br>'+
                '<br><p>Press any key to continue.</p>',
        }

        /* pre item instructions */
        var pre_1d_training = {
            type: 'html-keyboard-response',
            stimulus: 'We will start with a block of training on an easy stimulus first. We will give you feedback each trial.<br><br> Press any key to continue.</p>',
        }
        var pre_training = {
            type: 'html-keyboard-response',
            stimulus: 'Now another block of training with a different stimulus. We will give you feedback each trial.<br><br> Press any key to continue.</p>',
        }
        var pre_test = {
            type: 'html-keyboard-response',
            stimulus: 'Now we begin the test. You will no longer recieve feedback.<br>Please answer as fast and as accurately as possible.<br><br> Press any key to continue.</p>',
        }

        /* finished task instructions */
        var finished_task = {
            type: 'html-keyboard-response',
            stimulus: "You've finished this version of the task. Well done.<br><br>Press any key to continue.</p>",
        }

        //////////////////
        /* trial blocks */
        //////////////////

        /* feedback objects we can call later when we put together the procedure */
        size_feedback = {
            type: 'html-keyboard-response',
            stimulus: function(){
                var size_string = jsPsych.data.get().last(1).values()[0].stim_data.size;
                return '<p> correct answer: <span style="font-size: 40px;">'+JSON.stringify(size_string)+'</span><br><br>which is button: <span style="font-size: 40px;">'+JSON.stringify(resp_feedback[size_string])+'</span></p>';
            },
            choices: jsPsych.NO_KEYS,
            trial_duration: 800,
        }
        colour_feedback = {
            type: 'html-keyboard-response',
            stimulus: function(){
                var colour_string = jsPsych.data.get().last(1).values()[0].stim_data.colour;
                return '<p> correct answer: <span style="font-size: 40px;">'+JSON.stringify(colour_string)+'</span><br><br>which is button: <span style="font-size: 40px;">'+JSON.stringify(resp_feedback[colour_string])+'</span></p>';
            },
            choices: jsPsych.NO_KEYS,
            trial_duration: 800,
        }

        /* stroop task */
        var stroop_task = {
            timeline: [
                {
                    type: 'html-keyboard-response',
                    stimulus: '<div style="font-size:60px;">+</div>',
                    choices: jsPsych.NO_KEYS,
                    trial_duration: 500,
                    data: {
                        stim_data: jsPsych.timelineVariable('add_data'), // pull this in so we can access it in a subsequent trial
                        exp_part: "fixation",
                    }
                },
                { // size only training block
                    type: 'image-keyboard-response',
                    stimulus: 'stimuli/line.svg',
                    stimulus_height: jsPsych.timelineVariable('stim_size'),
                    choices: resp_keys,
                    trial_duration: 2000,
                    response_ends_trial: false,
                    data: {
                        stim_data: jsPsych.timelineVariable('add_data'),
                    }
                },
                { // colour only training block
                    type: 'image-keyboard-response',
                    stimulus: jsPsych.timelineVariable('trn_stim'),
                    stimulus_height: stim_height.medium,
                    choices: resp_keys,
                    trial_duration: 2000,
                    response_ends_trial: false,
                    data: {
                        stim_data: jsPsych.timelineVariable('add_data'),
                    }
                },
                { // stimulus block
                    type: 'image-keyboard-response',
                    stimulus: jsPsych.timelineVariable('stim_path'),
                    stimulus_height: jsPsych.timelineVariable('stim_size'),
                    choices: resp_keys,
                    trial_duration: 2000,
                    response_ends_trial: false,
                    data: {
                        stim_data: jsPsych.timelineVariable('add_data'),
                    }
                }
            ],
            timeline_variables: stimListFactory(colours, false, Object.keys(stim_height)),
            randomize_order: true,
            // 'repetitions:' would go here, but we will assign this more dynamically later
        }
        console.log(stroop_task.timeline_variables);

        /* false font task */
        var false_font_task = {
            timeline: [
                {
                    type: 'html-keyboard-response',
                    stimulus: '<div style="font-size:60px;">+</div>',
                    choices: jsPsych.NO_KEYS,
                    trial_duration: 500,
                    data: {
                        stim_data: jsPsych.timelineVariable('add_data'), // pull this in so we can access it in a subsequent trial
                        exp_part: "fixation",
                    }
                },
                { // size only training block
                    type: 'image-keyboard-response',
                    stimulus: 'stimuli/line.svg',
                    stimulus_height: jsPsych.timelineVariable('stim_size'),
                    choices: resp_keys,
                    trial_duration: 2000,
                    response_ends_trial: false,
                    data: {
                        stim_data: jsPsych.timelineVariable('add_data'),
                    }
                },
                { // colour only training block
                    type: 'image-keyboard-response',
                    stimulus: jsPsych.timelineVariable('trn_stim'),
                    stimulus_height: stim_height.medium,
                    choices: resp_keys,
                    trial_duration: 2000,
                    response_ends_trial: false,
                    data: {
                        stim_data: jsPsych.timelineVariable('add_data'),
                    }
                },
                { // stimulus block
                    type: 'image-keyboard-response',
                    stimulus: jsPsych.timelineVariable('stim_path'),
                    stimulus_height: jsPsych.timelineVariable('stim_size'),
                    choices: resp_keys,
                    trial_duration: 2000,
                    response_ends_trial: false,
                    data: {
                        stim_data: jsPsych.timelineVariable('add_data'),
                    }
                }
            ],
            timeline_variables: stimListFactory(colours, true, Object.keys(stim_height)),
            randomize_order: true,
            // 'repetitions:' would go here, but we will assign this more dynamically later
        }
        console.log(false_font_task.timeline_variables);

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
        var oned_image_paths = []; // init the variable
        oned_image_paths[colours.length] = "stimuli/line.svg";
        for (i = 0; i < colours.length; i++) {
           oned_image_paths[i] = `stimuli/${colours[i]}.svg`;
        }

        ////////////////////////
        /* procedure creation */
        ////////////////////////

        var stroop_colour_proc = [
            colour_instructions, // precede stroop with colour instructions
            pre_1d_training,
            // now we spread (shallow copy) the block object, and add to the keys inside - we need to be careful here, because it will only shallow copy: editing too deep will permanently alter the block object
            {...stroop_task, timeline: [stroop_task.timeline[0], {...stroop_task.timeline[2], data: {...stroop_task.timeline[2].data, exp_part: "training", test_type: "colour_only"}}, colour_feedback], repetitions: num_tr_blocks}, // append feedback to the stroop and add repetitions
            pre_training, // pre task instructions
            colour_instruction_reminder, // precede the task with the reminder of the task
            // same again - spread the block object and add to the keys inside
            {...stroop_task, timeline: [stroop_task.timeline[0], {...stroop_task.timeline[3], data: {...stroop_task.timeline[3].data, exp_part: "training", test_type: "colour"}}, colour_feedback], repetitions: num_tr_blocks},
            pre_test,
            // same again - spread the block object and add to the keys inside
            {...stroop_task, timeline: [stroop_task.timeline[0], {...stroop_task.timeline[3], data: {...stroop_task.timeline[3].data, exp_part: "testing", test_type: "colour"}}], repetitions: num_blocks},
            finished_task
        ];
        
        var stroop_size_proc = [
            size_instructions,
            pre_1d_training,
            {...stroop_task, timeline: [stroop_task.timeline[0], {...stroop_task.timeline[1], data: {...stroop_task.timeline[1].data, exp_part: "training", test_type: "size_only"}}, size_feedback], repetitions: num_tr_blocks},
            pre_training,
            size_instruction_reminder,
            {...stroop_task, timeline: [stroop_task.timeline[0], {...stroop_task.timeline[3], data: {...stroop_task.timeline[3].data, exp_part: "training", test_type: "size"}}, size_feedback], repetitions: num_tr_blocks},
            pre_test,
            {...stroop_task, timeline: [stroop_task.timeline[0], {...stroop_task.timeline[3], data: {...stroop_task.timeline[3].data, exp_part: "testing", test_type: "size"}}], repetitions: num_blocks},
            finished_task
        ];

        var falsefont_colour_proc = [
            colour_instructions,
            pre_1d_training,
            {...false_font_task, timeline: [false_font_task.timeline[0], {...false_font_task.timeline[2], data: {...false_font_task.timeline[2].data, exp_part: "training", test_type: "colour_only"}}, colour_feedback], repetitions: num_tr_blocks},
            pre_training,
            colour_instruction_reminder,
            {...false_font_task, timeline: [false_font_task.timeline[0], {...false_font_task.timeline[3], data: {...false_font_task.timeline[3].data, exp_part: "training", test_type: "colour"}}, colour_feedback], repetitions: num_tr_blocks},
            pre_test,
            {...false_font_task, timeline: [false_font_task.timeline[0], {...false_font_task.timeline[3], data: {...false_font_task.timeline[3].data, exp_part: "testing", test_type: "colour"}}], repetitions: num_blocks},
            finished_task
        ];

        var falsefont_size_proc = [
            size_instructions,
            pre_1d_training,
            {...false_font_task, timeline: [false_font_task.timeline[0], {...false_font_task.timeline[1], data: {...false_font_task.timeline[1].data, exp_part: "training", test_type: "size_only"}}, size_feedback], repetitions: num_tr_blocks},
            pre_training,
            size_instruction_reminder,
            {...false_font_task, timeline: [false_font_task.timeline[0], {...false_font_task.timeline[3], data: {...false_font_task.timeline[3].data, exp_part: "training", test_type: "size"}}, size_feedback], repetitions: num_tr_blocks},
            pre_test,
            {...false_font_task, timeline: [false_font_task.timeline[0], {...false_font_task.timeline[3], data: {...false_font_task.timeline[3].data, exp_part: "testing", test_type: "size"}}], repetitions: num_blocks},
            finished_task
        ];
        
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

        var shuffled_procedure = shuffle(unshuffled_procedure); // shuffle the procedure
        var flattened_procedure = shuffled_procedure.flat(); // flatten it into one layer
        
        for (i = 0; i < flattened_procedure.length; i++) { // loop through the shuffled and flattened procedure array, and push each jsPsych trial block to the timeline
            timeline.push(flattened_procedure[i]);
        }
