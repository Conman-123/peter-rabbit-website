$(document).ready(function() {

//~~~~~~~~~~~~~~General~~~~~~~~~~~~~~~~~~~
	
	//If JavaScript is available, change the links that lead to the static character profile page so they lead to the more interactive version
	$('.characterProfileLink').attr('href', 'characterProfilePage.html');

	
//~~~~~~~~~~~~~~~Story~~~~~~~~~~~~~~~~~~~~
	
	//show the relevant character popup thing
	function showCharacter(event) {
		var popupId = $(this).attr('class') + 'Popup';
		$('#' + popupId).removeClass('hidden')
			.css({'top': event.pageY, 'left': event.pageX});
	}
	
	//hide the relevant character popup thing
	function hideCharacter(event) {
		var popupId = $(this).attr('class') + 'Popup';
		$('#' + popupId).addClass('hidden');
	}
	
	//Handle the user hovering over a character's name
	$('.story a').hover(showCharacter, hideCharacter);
	
//~~~~~~~~~~~~~~~Story Game~~~~~~~~~~~~~~~~

	//Style the button the user clicked, prevent the user from clicking anything else, show the next page button, and add the new text.
	function chooseHidingPlace(event) {
		event.preventDefault();
		$('#storyGameNav .nextPageBtn').css('visibility', 'visible');
		$(this).css({'box-shadow': '0 5px 15px 0 #bcc, 3px 0 15px 5px #cdd', 'transform': 'scale(0.9)'});
		$('#storyGame').css('pointer-events', 'none');
		
		$('#storyGameNav span').text('Continue with the story to see if you were right');
		
		//The code for displaying different text depending if the user got the right answer. I left this in to show that I could have done this but I chose not to because I felt it was a bit anticlimactic.
		/*var hidingPlace = event.target;
		hidingPlace = $(hidingPlace).closest('a');
		
		if ($(hidingPlace).attr('id') == 'hideFlowerPots') {
			$('#hideOptions').after('<h3>Uh oh! Mr McGregor looked there!</h3>');
		}
		else if ($(hidingPlace).attr('id') == 'hideWateringCan') {
			$('#hideOptions').after('<h3>I think you chose correctly. Let\'s find out!</h3>');
		}*/
	}
	
	//Hide the 'Next Page' button when the page loads
	$('#storyGameNav .nextPageBtn').css('visibility', 'hidden');
	
	//Handle the user clicking one of the hiding places
	$('#storyGame a').click(chooseHidingPlace);




//~~~~~~~~~~Character Profiles~~~~~~~~~~~~
	
	//Close the character profile modal
	function hideModal() {
		$(this).parent().addClass('hidden');
		$('#overlay').remove();
	}
	
	//show the character profile modal
	function showModal(event) {
		event.preventDefault();
		var id = $(this).attr('id');
		var modal = id + 'Modal';
		$('#' + modal).removeClass('hidden');
		
		//Disable Everything in Background. Code adapted from 'Yi Jiang': https://stackoverflow.com/questions/3674700/disable-all-page-elements-with-modal-feature-using-jquery
		overlay = $('<div></div>').prependTo('body').attr('id', 'overlay');
	}
	
	//Handle the 'Close' button being clicked
	$('.btn-close').click(hideModal);

	//Handle the character being clicked
	$('#characterProfilePage a').click(showModal);


	
	
//~~~~~~~~~~~~Character Quiz~~~~~~~~~~~~~~~
	
	var totalCorrect = 0;
	var currentForm = '';
	var currentQuiz = ''
	var nextQuiz = ''
	
	//Function to check if the user's answer and load in the relevant parts of the form
	function handleSubmit() {
		var formId = $(this).closest('section').find('form').attr('id');
		currentForm = formId;
		var inputIds = ['#' + formId + '-1', '#' + formId + '-2', '#' + formId + '-3'];
		var answer = '';

		currentQuiz = $('#' + currentForm).closest('section').attr('id');
		nextQuiz = currentQuiz.split(/([^A-Za-z])/);
		nextQuiz = nextQuiz[0] + (parseInt(nextQuiz[1]) + 1);
		
		for (var i = 0; i < inputIds.length; i++) {
			var input = inputIds[i];
			if ($(input).prop('checked')) {
				answer = $(input).val();
			}
		}
		
		if (answer != '') {
			if (answer == 'correct') {
				$('#' + currentQuiz + ' h5.correct').css('visibility', 'visible');

				totalCorrect += 1;
			}
			else if (answer == 'incorrect') {
				$('#' + currentQuiz + ' h5.incorrect').css('visibility', 'visible');
			}
						
			$('#' + currentQuiz + ' label img').css('visibility', 'visible');
			$('#' + currentQuiz + ' .btnNext').css('visibility', 'visible');
			$('#' + currentQuiz + ' .submitBtn').prop( "disabled", true);
			$('#' + formId + ' input:radio').prop( "disabled", true);
		}
	}
	
	//Function to close the quiz and reset all of the variables
	function closeQuiz(event) {
		event.preventDefault();
		$('.characterQuiz').addClass('hidden');
		$('#overlay').remove();
		
		$('.characterQuiz label img').css('visibility', 'hidden');
		$('.characterQuiz .btnNext').css('visibility', 'hidden');
		$('.characterQuiz h5.incorrect').css('visibility', 'hidden');
		$('.characterQuiz h5.correct').css('visibility', 'hidden');
		$('.characterQuiz .submitBtn').prop( 'disabled', false);
		$('.characterQuiz input:radio').prop({'disabled': false, 'checked': false});
		
		totalCorrect = 0;
		currentForm = '';
		currentQuiz = ''
		nextQuiz = ''
	}
	
	//Handle the 'Submit' button being clicked'
	$('.submitBtn').click(handleSubmit);
	
	//Handle the big 'Character Quiz' button on the 'Characters' page being clicked
	$('.characterQuizLink').click(function () {
		$('#characterQuiz1').removeClass('hidden');
		overlay = $('<div></div>').prependTo('body').attr('id', 'overlay');
	});
	
	//Handle the window-close-cross in the top right being clicked
	$('.closeX, #quizClose').click(closeQuiz);
	
	//Handle the 'Next' button being clicked
	$('.characterQuiz .btnNext').click(function () {
		$('#' + currentQuiz).addClass('hidden');
		$('#' + nextQuiz).removeClass('hidden');
		if (nextQuiz == 'characterQuiz4') {
			$('#characterQuiz4 h2').text(totalCorrect + ' out of 3');
			$('#characterQuiz4 p').text(function  () {
				if (totalCorrect == 3) {
					return 'Great job!'
				}
				else if (totalCorrect == 2) {
					return 'Not bad!'
				}
				else if (totalCorrect == 1) {
					return 'Could be better'
				}
				else if (totalCorrect == 0) {
					return 'Nice try'
				}
			});
		}
	});
	
	//Handle the 'Play Again' button being clicked
	$('#playAgain').click(function () {
		closeQuiz(event);
		$('.characterQuizLink').trigger('click');
	});
	
	//Run character quiz when linked from another page with '#launchCharacterQuiz' in URL
	var hashValue = location.hash;
	if (hashValue == '#launchCharacterQuiz') {
		$('#characterQuiz1').removeClass('hidden');
		overlay = $('<div></div>').prependTo('body').attr('id', 'overlay');
	}

	
});