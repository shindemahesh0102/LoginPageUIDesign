// 10/27/2014 - BB
// NOTE: ADDING CONSOLE REFERENCES WILL BREAK IE8 ON WINDOWS XP
//
var AUTO_LOOKUP_MULTIPLE_FOUND = "1";
var AUTO_LOOKUP_MULTIPLE_FOUND_WITH_SECONDARY_KEY = "2";
var STANDARD_FIELD_PAYMENT_METHOD = "143";
var PAYMENT_METHOD_PAY_WITH_CREDIT_CARD = "1458";
var PAYMENT_METHOD_PAY_WITH_PAYPAL = "1459";
var totalPrice = "";
var payPalPlanId = "";

//create dummy console log for browsers that don't support it
if (typeof console == "undefined") {
	window.console = {
		log: function () { }
	};
}

// console.log mock object used to prevent errors in browsers without developer tools
function verifyConsole() {
	if (!window.console) {
		window.console = new function () {
			this.log = function (str) { };
			this.dir = function (str) { };
		};
	}
};

function hideEmailLookupScrim() {
	setTimeout(function () {
		$("#scrim").css("display", "none");
		$(".scrim").css("display", "none");
	}, 600);
}

function showEmailLookupScrim() {
	$("#scrim").css("display", "block");
	$(".scrim").css("display", "block");
}

String.prototype.startsWith = function (str) {
	return (this.indexOf(str) === 0);
};

function toggleDisplay(context) {
	if ($(context).is(":hidden")) {
		if ($('#showoptlabel').is(":hidden")) {
			$(context).css("display", "block");
		} else {
			$(context).css("display", "none");
		}
	}
}

var keepSubmitDisabled = false;
function disableSubmit() {
	$('input[type="submit"]').attr('disabled', true);		
}

function enableSubmit() {
	if (!keepSubmitDisabled)
		$('input[type="submit"]').attr('disabled', false);		
}


var initialized = true;
//DRG-2942
var lookupEmailCalled = false;
$(document).ready(function () {
	$('input[type="submit"]').bind('click', function (e) {
		keepSubmitDisabled = true;
		setTimeout(disableSubmit, 1);
	});
	$('input:checkbox').bind('click', function (e) {
		stopIframePolling();
		checkOtherFillinCheckbox(this);
		checkConditions(this);
	});
	$('input:radio').bind('click', function (e) {
		stopIframePolling();
		checkOtherFillinRadio(this);
		checkConditions(this);
	});
	$('input:text').blur(function () {
		stopIframePolling();
		checkConditions(this);
	});
	$('textarea').blur(function () {
		stopIframePolling();
		checkConditions(this);
	});
	$('select').change(function () {
		stopIframePolling();
		checkConditions(this);
		toggleOther();
	});
	$('.paidElement').bind('click', function (e) {
		clearOtherPaidElements(this);
	});
	$('option.paidElement').parent().bind('change', function (e) {
		clearOtherPaidElements(this);
	});

	$('#showoptdesc').bind('click', function (e) {
		$('#showoptlabel').toggle('fast', function () {
		});
		$('#hideoptlabel').toggle('fast', function () {
		});
		$('.longdescopt').toggle('fast', function () {
			toggleDisplay(this);
		});
	});
	$('.tierparent').bind('click', function (event) {
		var hasConditionalResponse = false;
		//check if multiple response also has single response mapping
		if ($(this).hasClass('condrespsource')) {
			hasConditionalResponse = true;
		}

		//hide or show multiple responses inside a tier
		var childDiv = $(this).attr('child');
		if ($('.' + childDiv).is(":visible")) {
			$('.' + childDiv).fadeOut();
		} else {
			$('.' + childDiv).fadeIn();
		}
		if (!$(this).is(':checked')) {
			//uncheck all multiple responses inside a tier
			var childIds = $('input:checkbox:checked.tierchild' + $(this).attr('value')).map(function () {
				return this.id;
			}).get();
			jQuery.each(childIds, function () {
				$('#' + this).attr('checked', false);
				var childDiv2 = $('#' + this).attr('child');
				if ($('.' + childDiv2).is(":visible")) {
					$('.' + childDiv2).fadeOut();
				} else {
					$('.' + childDiv2).fadeIn();
				}

				//hide all children that have a single response mapping
				if (hasConditionalResponse) {
					$('.condrespsourceid' + $('#' + this).val()).fadeOut();
				}
			});
		}
	});
	$('.tierchild').bind('click', function (event) {
		if ($(this).hasClass('condrespsource')) {
			var parentId = $(this).attr('parent');
			//if any of these (Example: tierchild746) are checked then hide parent
			if ($(this).is(':checked')) {
				//hide parent
				$('.condrespsourceid' + parentId).fadeOut();
			} else {
				//verify if any tier children are checked, if any are checked then show tier header
				var childIds = $('input:checkbox:checked.tierchild' + parentId).map(function () {
					return this.id;
				}).get();
				var foundChild = false;
				jQuery.each(childIds, function () {
					foundChild = true;
				});
				if (!foundChild) {
					$('.condrespsourceid' + parentId).fadeIn();
				}
			}
		}
	});
	$('.condrespsource').bind('click change onload', function (event) {
		if ($(this).attr("type")=="checkbox") {
			//hide or show single response that is mapped to the multiple response
			if ($(this).is(':checked')) {
				$('.condrespsourceid' + $(this).val()).fadeIn();
			} else {
				$('.condrespsourceid' + $(this).val()).fadeOut();
			}
			applyConditionalResponses();
		}
		else if ($(this).attr("type")=="radio") {
			//hide or show single response that is mapped to another single response
			$("div[class^='condrespsourceid'] input:checked").removeAttr("checked");
			$("div[class^='condrespsourceid']").fadeOut();
			$('.condrespsourceid' + $(this).val()).fadeIn();
		}
	});
	
	checkConditions(); //hide and show defaults
	hideOtherFillin();
	toggleOther();

	//use newly shown defaults for custom logic in the ajax action
	setTimeout(function () { checkConditions(); }, 1);
});

// conditionalHandlers stores a reference of functions to call when evaluateConditionalContent retuns a JSON object
var conditionalHandlers = [];
// prevent from calling handlers more than once (since checkConditions() is executed more than once)
var conditionalHandlersCalled = false;

function registerConditionalHandler(callback) {
	conditionalHandlers.push(callback);
}

function callConditionalHandlers() {
	if (!conditionalHandlersCalled) {
		$.each(conditionalHandlers, function (i) {
			this();
		});
	}

	conditionalHandlersCalled = true;
}

function toggleOther() {
	//hide all other
	var oecBoxes = $('div[id^="other"]');
	for (var i = 0; i < oecBoxes.length; i++) {
		var oecId = $(oecBoxes[i]).attr('id');
		if (!oecId.startsWith("otherfillinid_")) {
			$("#" + oecId).hide();
		}
	}
	var selectBoxes = $('select');
	for (var i = 0; i < selectBoxes.length; i++) {
		//show other that are selected BUT ignore standard fields as those should not have related OEC
		if ($(selectBoxes[i]).attr('name') != null && $(selectBoxes[i]).attr('name') != "" && !$(selectBoxes[i]).hasClass("standardField")) {
			var standardField = false;
			if ($(selectBoxes[i]).parent() != undefined && $(selectBoxes[i]).parent().attr('class') != undefined && $(selectBoxes[i]).parent().attr('class').indexOf("standard-field") > -1) {
				standardField = true;
			}
			if (!standardField) {
				var selectedValue = $('select[name="' + $(selectBoxes[i]).attr('name') + '"]' + ' option:selected').val();
				$("#other" + selectedValue).fadeIn();
			}
		}
	}
}

function genericValidation() {
	var error = false;
	{
		//validate credit card expire date for HPCI
		var month = $('#p32 select[name$="_month"]').val();
		var year = $('#p32 select[name$="_year"]').val();
		if (year != '' && month != '') {
			var today = new Date();
			var currentMonth = today.getMonth() + 1;
			var currentDate = today.getFullYear() + "" + (currentMonth < 10 ? "0" + currentMonth: currentMonth);
			var expireDate = year + "" + month;
			if (currentDate <= expireDate) {
				//console.log('good expire date');
			} else {
				alert('The expire date for your credit card has passed.');
				error = true;
			}
		}
	}
	if (error)
		disableSubmit();
	else
		enableSubmit();
}

function checkConditions(fieldLastChanged) {
	//genericValidation();
	//showScrim();
	if (fieldLastChanged != undefined) {
		var fieldLastChangedId = $(fieldLastChanged).attr('id');
		if (fieldLastChangedId == 'id49') { //promocode
			if (campaignPromocodeChanged != undefined) {
				campaignPromocodeChanged(fieldLastChanged);
			}
		} else if (fieldLastChangedId == 'id7' //business country
			|| fieldLastChangedId.startsWith('id158') //residential country
			|| fieldLastChangedId.startsWith('id112') //requested version
			|| fieldLastChangedId.startsWith('id151')) { //campaign requested version
			if (campaignCountryOrRequestedVersionChanged != undefined) {
				campaignCountryOrRequestedVersionChanged(fieldLastChanged);
			}
		}
	}
	checkConditionsPart2(fieldLastChanged);
}

function checkConditionsPart2(fieldLastChanged) {
	var dragonjsessionid = $('#dragonjsessionid').val();
	var url = 'evaluateConditionalContent.do';
	if (dragonjsessionid != null && dragonjsessionid != '') {
		url = url + ';jsessionid=' + dragonjsessionid;
	}
	var parms = getFormData();
	if (dragonjsessionid != null && dragonjsessionid != '') {
		parms = parms + '&jsessionid=' + dragonjsessionid + "&timestemp=" + new Date().getTime();
	}
	if (fieldLastChanged != undefined) {
		var fieldLastChangedName = $(fieldLastChanged).attr('name');
		parms = parms + '&fieldLastChangedName=' + fieldLastChangedName;
		setTimeout(function () {
			checkConditions();
		}, 900);
	}

	//campaign specific logic
	var campaignOptionCount = $('.CCprod').length;
	if (campaignOptionCount > 0) {
		parms = parms + '&paidContentResponses=clear';
	}
	var campaignResponses = "";
	var campaignElementExists = $("div[id^=campaignPlaceholder_]").length>0;
	if ($("li.CCprod input:checked").length>0) {
		//a campaign price is selected, so add it to the param list
		$("li.CCprod input:checked").each(function(){
			campaignResponses+=$(this).val()+"_"+$(this).attr("name").split("_")[1];
		});
		parms = parms + '&campaignResponses=' + campaignResponses;
	} else if (campaignElementExists) {
		//if there is a campaign element on the page, but no li.CCprod exists then we have an invalid promo and default pricing should be used
		parms += '&campaignResponses=clear';
	}
	if ($(".paidElement").length>0 && $(".paidElement:checked").length==0 && campaignElementExists && campaignResponses.length>0) {
		parms += '&removeNonCampaignPricingFromSubscriberMap=true';
	}
	
	var foundNewDisplay = false;
	$.get(url + "?" + parms, "", function (data) {
		if (data != null) {
			try {
				var aContent = data.conditions.content;
				for (var iContent = 0; iContent < aContent.length; iContent++) {
					var content = aContent[iContent];
					if (content.divid != 'end') {
						if (content.display == 'true') {
							if ($('#' + content.divid).css('display') == 'none') {
								foundNewDisplay = true;
							}
							$('#' + content.divid).fadeIn();
						} else {
							$('#' + content.divid).hide();
						}
						if (content.defaultValue != null) {
							if (content.defaultValue == 'clear') {
								$('#' + content.elementid).val('');
								$('#r' + content.elementid).val('');
							} else {
								$('#' + content.elementid).val(content.defaultValue);
								$('#r' + content.elementid).val(content.defaultDescription);
							}
						}
						if (content.exporturlget != null) {
							window.location.href = content.exporturlget;
						} 
						if (content.exporturlpost != null) {
							var args = content.urlparams.split("&");
							var response = "<form name='dragonpost' method='POST' action='" + content.exporturlpost + "'>";
							
							for (var i = 0; i < args.length; i++)
							{
								var parts = args[i].split("=");
								var argstring = "<input type='hidden' name='" + parts[0] + "' value='" + parts[1] + "'>";
								response = response.concat(argstring);
							}

							response = response.concat("</form>" +
							                           "<script type='text/javascript'>" +
							                           "document.forms['dragonpost'].submit();" +
							                           "</script>");
							       					
							$('body').html(response);
						}
					}
				}
				if (data.additionFields != undefined) {
					var additionFields = data.additionFields;
					for (var iAdditionField = 0; iAdditionField < additionFields.length; iAdditionField++) {
						var additionField = additionFields[iAdditionField];
						var operands = additionField.operands;
						$('input[name=demo'+additionField.totalid+']').val('');
						for (var iOperand = 0; iOperand < operands.length; iOperand++) {
							var total = 0;
							total = $('input[name=demo'+additionField.totalid+']').val();
							total = Number(total);
							var operand = operands[iOperand].operand;
							var subtotal = $('input[name=demo'+operand+']').val();
							subtotal = Number(subtotal);
							total += subtotal;
							$('input[name=demo'+additionField.totalid+']').val(total);
						}
					}
				}

				$('.drg-id64').val(data.subtotal); //this is interfering with demographics with the same id.  I am turning it off since we shouldn't need subtotal,tax,taxrate to be editable anyway.
				$('#outputresponselabel64').html(data.subtotal);
				
				$("#id63").val(data.total); //update the Dollar Amount (Total) field with the value from SiteUtils
				totalPrice = data.total;
				payPalPlanId = data.payPalPlanId;
				
				/* DRG-3564 add tax */
				$('.drg-id62').val(data.taxamount);
				$('#outputresponselabel62').html(data.taxamount);
				$('.drg-id115').val(data.taxrate);
				$('#outputresponselabel115').html(data.taxrate);
				
				
				if (data.emailreadonly == 'true' && $('#id13').val() != '') {
					$('#id13').attr("readonly", "readonly");
				}
				calculatePaymentMethod(fieldLastChanged);
				//hideScrim();
				
				if (foundNewDisplay) {
					setTimeout(function () { 
						checkConditions(); 
					}, 1);
				}
			} catch (err) {
				alert('err=' + err);
				//hideScrim();
			}
		} else {
			/* DRG-4551 */
			//console.log("no data returned for request: " + url + "?" + parms);
			//alert('bad= ' + url + "?" + parms);
			//hideScrim();
		}
		hideOtherFillin();
		callConditionalHandlers();
		if ( top !== self ) { // we are in an iframe
			if (typeof sendDocHeightMsg === 'function') {
				sendDocHeightMsg();
			}
		}
	}, "json");


	try {
		//DRG-2942
		var callApplyCondResponse = false;

		if (initialized) {
			callApplyCondResponse = true;
			initialized = false;
			//reset tier groups after failed validation
			var childIds = $('input:checkbox:checked.tierparent').map(function () {
				return this.id;
			}).get();

			jQuery.each(childIds, function () {
				var childDiv2 = $('#' + this).attr('child');
				$('.' + childDiv2).fadeIn();
			});

			//reset conditional responses after failed validation
			//DRG-2942
			//applyConditionalResponses();
		}
		//DRG-2942
		if (callApplyCondResponse || lookupEmailCalled) {
			applyConditionalResponses();
		}
	} catch (err) {
		alert('err=' + err);
	}

	//check single responses for conditional responses
	var conditionalResponseIds = $('.condrespconditional').map(function () {
		return this.id;
	}).get();
	jQuery.each(conditionalResponseIds, function () {
		var responseDiv = '#' + this;
		var conditions = $(responseDiv).attr('conditions');
		if (typeof conditions != 'undefined') {
			if (conditions != '') {
				var dragonjsessionid = $('#dragonjsessionid').val();
				var url = 'evaluateCondition.do';
				if (dragonjsessionid != null && dragonjsessionid != '') {
					url = url + ';jsessionid=' + dragonjsessionid;
				}
				var parms = getFormData();
				if (dragonjsessionid != null && dragonjsessionid != '') {
					parms = parms + '&jsessionid=' + dragonjsessionid + "&timestemp=" + new Date().getTime();
				}
				parms = parms + '&conditions=' + conditions;
				$.get(url + "?" + parms, "", function (data) {
					if (data != null) {
						try {
							if (data.show == 'false') {
								$(responseDiv).fadeOut();
							} else {
								$(responseDiv).fadeIn();
							}
						} catch (err) {
							alert('err=' + err);
						}
					} else {
						// DRG-4551
						//alert('bad= ' + url + "?" + parms);
						//console.log("no data returned for request: " + url + "?" + parms);
					}
				}, "json");
			}
		}
	});
}

function stopIframePolling() {
	embeddedPolling = false;
}

function applyConditionalResponses() {
	jQuery.each($('input:checkbox:checked.condrespsource,input:radio:checked.condrespsource,option:selected.condrespsource'), function () {
		var responseValue = $(this).val();
		$('.condrespsourceid' + responseValue).fadeIn();
		
		//when using tiers, hide the parent (doesn't affect normal conditional resp setups)
		var parentId = $(this).attr('parent');
		$('.condrespsourceid' + parentId).fadeOut();
	});
}

function generateRepeatedGroup(triggerId, repeatedId) {
	var repeatedGroupTrigger = $("#id" + triggerId).val();
	if (repeatedGroupTrigger != '') {
		var repeatedGroupTriggered = $("#hiddenrepeatertriggered" + triggerId + "_" + repeatedId).val();
		if (repeatedGroupTrigger != repeatedGroupTriggered) {
			$("#hiddenrepeatertriggered" + triggerId + "_" + repeatedId).val(repeatedGroupTrigger);
			var listOfRepeatedPieces = '';
			listOfRepeatedPieces = listOfRepeatedPieces + '<ul>';
			for (var i = 0; i < repeatedGroupTrigger; i++) {
				listOfRepeatedPieces = listOfRepeatedPieces + '<li>';
				var repeatedPiece = $("#hiddenrepeater" + repeatedId).html();
				repeatedPiece = repeatedPiece.replace("[-HIDDENREPEATER-]", "" + (i + 1));
				listOfRepeatedPieces = listOfRepeatedPieces + repeatedPiece;
				listOfRepeatedPieces = listOfRepeatedPieces + '</li>';
			}
			listOfRepeatedPieces = listOfRepeatedPieces + '</ul>';
			$("#p" + repeatedId).html(listOfRepeatedPieces);
		}
	}
}

function checkOtherFillinCheckbox(checkbox) {
	if ($(checkbox).is(':checked')) {
		$('#hideother' + $(checkbox).val()).fadeIn();
	} else {
		$('#hideother' + $(checkbox).val()).fadeOut();
		//drg-3558
		$('#hideother' + $(checkbox).val() + ' input').val('');
		$('#other' + $(checkbox).val() + ' input').val('');
	}
}

function checkOtherFillinRadio(radiobutton) {
	var radioid = $(radiobutton).attr('id');
	var selectedvalue = $(radiobutton).val();
	$('input[id*=' + radioid + ']').each(function (i) {
		if ($(this).val() == selectedvalue) {
			$('#hideother' + $(this).val()).fadeIn();
		} else {
			$('#hideother' + $(this).val()).fadeOut();
			//drg-3558
			$('#hideother' + $(this).val() + ' input').val('');
			$('#other' + $(this).val() + ' input').val('');
		}
	});
}

function hideOtherFillin() {
	$('input:radio').each(function (i) {
		var radioid = $(this).attr('id');
		var selectedvalue = $('input[id*=' + radioid + ']:radio:checked').val();
		if ($(this).val() == selectedvalue) {
			$('#hideother' + $(this).val()).fadeIn();
		} else {
			$('#hideother' + $(this).val()).fadeOut();
		}
	});
	$('input:checkbox').each(function (i) {
		if ($(this).is(':checked')) {
			$('#hideother' + $(this).val()).fadeIn();
		} else {
			$('#hideother' + $(this).val()).fadeOut();
		}
	});
}

function getFormData() {
	var parms = '';
	var previousField = '';
	$.each($('#standardForm').serializeArray(), function (i, field) {
		if (field.name.startsWith("demo") || field.name.startsWith("opt") || field.name == "dragon_pagenumber") {
			var fieldSelector = '[name=' + field.name + ']';
			if (!$(fieldSelector).attr('readonly')) {
				var value = field.value;
				if (field.name.length > 4) {
				    var elementId = field.name.substring(4);
					display = $('#disp'+elementId).css('display');
					if ($('#disp'+elementId).css('display') == 'none') {
						value = '';
					}
				}
				if (field.name == previousField) {
					parms = parms + ',' + encodeURIComponent(value);
				} else {
					parms = parms + '&' + field.name + '=' + encodeURIComponent(value);
				}
				previousField = field.name;
			}
		}
	});
	parms = parms.substring(1);
	return parms;
}

function lookupByEmail(secondaryLookupId, secondaryLookupPrimaryMessageId, secondaryLookupSecondaryMessageId, useSecondaryLookup) {
	showEmailLookupScrim();
	//DRG-2942
	lookupEmailCalled = true;
	var dragonjsessionid = $('#dragonjsessionid').val();
	var url = 'lookupByEmail.do';
	if (dragonjsessionid != null && dragonjsessionid != '') {
		url = url + ';jsessionid=' + dragonjsessionid;
	}
	var email = $('#id13').val();
	var parms = 'email=' + email;
	if (secondaryLookupId != undefined && useSecondaryLookup != undefined) {
		var secondaryLookupValue = $('#id'+secondaryLookupId).val();
		if (secondaryLookupValue != undefined) {
			parms = parms + '&secondaryLookupId=' + secondaryLookupId + '&secondaryLookupValue=' + secondaryLookupValue;
		}
	}
	if (email=="") {
		hideEmailLookupScrim();
		return;
	}
	if (dragonjsessionid != null && dragonjsessionid != '') {
		parms = parms + '&jsessionid=' + dragonjsessionid + "&timestamp=" + new Date().getTime();
	}
	if (email) {
		$.get(url + "?" + parms, "", function (data) {
			if (data != null) {
				try {
					var aContent = data.lookup.content;
					for (var iContent = 0; iContent < aContent.length; iContent++) {
						var content = aContent[iContent];
						if (content.contentid != 'end') {
							$('#id13').attr("readonly", "readonly");
							if (content.categoryid == 'multiple') {
								$('input:checkbox[id=' + content.contentid + '][value="' + content.value + '"]').attr('checked', true);
								if (content.elementid != undefined)
									$('input:checkbox[name=' + content.elementid + '][value="' + content.value + '"]').attr('checked', true);
							} else {
								if (content.categoryid == 'opt') {
									var elType = $('input[id=' + content.contentid + ']').attr('type');
									if (elType==undefined)
										elType = $('select[id=' + content.contentid + ']').length==1 ? "select" : "";
									
									if (elType=='select') {
										if (content.value=="N")
											$('select[id=' + content.contentid + '] option[value="2"]').attr('selected', true);
										else
											$('select[id=' + content.contentid + '] option[value="' + content.value + '"]').attr('selected', true);
									}
									else
										$('input:checkbox[id=' + content.contentid + '][value="' + content.value + '"]').attr('checked', true);
									
									if (content.elementid != undefined)
										$('input:checkbox[name=' + content.elementid + '][value="' + content.value + '"]').attr('checked', true);
								} else {
									if (content.categoryid == 'radio') {
										if ( (content.contentid).indexOf("opt")!==-1 && content.value=="N" ) //opts have an N and we need to convert this
											$('input:radio[name=' + content.elementid + '][value="2"]').attr('checked', true);
										else
											$('input:radio[id=' + content.contentid + '][value=' + content.value + ']').attr('checked', true);
										
										if (content.elementid != undefined)
											$('input:radio[name=' + content.elementid + '][value=' + content.value + ']').attr('checked', true);
									} else {
										//text standard fields and demos fall in here
										if (content.elementid != undefined) //this seems to be the better selector when available, so try it first
											$('[name=' + content.elementid + ']').val(content.value);
										else
											$('#' + content.contentid).val(content.value);
									}
								}
							}
						}
					}
					
					if (data.autolookup != undefined && secondaryLookupPrimaryMessageId != undefined) {
						if (secondaryLookupId != undefined)
							$($("#p"+secondaryLookupId)[0]).show();
						if (data.autolookup == AUTO_LOOKUP_MULTIPLE_FOUND) {
							//show primary error message
							$('#'+secondaryLookupPrimaryMessageId).show();
							//attach blur handler to secondary field
							$("#id"+secondaryLookupId).blur(function() { lookupByEmail(secondaryLookupId, secondaryLookupPrimaryMessageId, secondaryLookupSecondaryMessageId, true); } );
						} else {
							//show secondary error message
							$('#'+secondaryLookupPrimaryMessageId).hide();
							$('#'+secondaryLookupSecondaryMessageId).show();
							$($("#p13")[0]).hide();
							$($("#p"+secondaryLookupId)[0]).hide();
							$($("input#id13")[0]).val("");
							$($("input#id"+secondaryLookupId)[0]).val("");
						}
					} else {
						if (secondaryLookupPrimaryMessageId != undefined) {
							$('#'+secondaryLookupPrimaryMessageId).hide();
						}
						if (secondaryLookupSecondaryMessageId != undefined) {
							$('#'+secondaryLookupSecondaryMessageId).hide();
						}
					}
					hideEmailLookupScrim();
				} catch (err) {
					alert('err=' + err);
					hideEmailLookupScrim();
				}
			} else {
				/* DRG-4551 */
				//console.log("no data returned for request: " + url + "?" + parms);
				// alert('bad= ' + url + "?" + parms);
				hideEmailLookupScrim();
			}
			checkConditions();
		}, "json");
	}
}

function lookupFreshAddress() {
	showEmailLookupScrim();
	lookupEmailCalled = true;
	var dragonjsessionid = $('#dragonjsessionid').val();
	var url = 'lookupFreshAddress.do';
	if (dragonjsessionid != null && dragonjsessionid != '') {
		url = url + ';jsessionid=' + dragonjsessionid;
	}
	var email = $('#id13').val();
	var parms = 'email=' + email;
	if (email=="") {
		hideEmailLookupScrim();
		return;
	}
	if (dragonjsessionid != null && dragonjsessionid != '') {
		parms = parms + '&jsessionid=' + dragonjsessionid + "&timestamp=" + new Date().getTime();
	}
	if (email) {
		setTimeout(disableSubmit, 1);
		$("#freshaddressmessage").html('');
		$.get(url + "?" + parms, "", function (data) {
			if (data != null) {
				try {
					var message = data.message;
					if (message != '') { //need to change this to a toggle controlled on setup screen
						if (data.validation_type == '1') { //FRESH_ADDRESS_VALIDATION_STOP_ON_ERROR
							$("#freshaddressmessage").html(message);
							setTimeout(disableSubmit, 1);
						} else {
							setTimeout(enableSubmit, 1);
						}
					} else {
						setTimeout(enableSubmit, 1);
					}
					hideEmailLookupScrim();
				} catch (err) {
					alert('err=' + err);
					hideEmailLookupScrim();
				}
			} else {
				/* DRG-4551 */
				//console.log("no data returned for request: " + url + "?" + parms);
				// alert('bad= ' + url + "?" + parms);
				hideEmailLookupScrim();
			}
			checkConditions();
		}, "json");
	}
}

//drg-4517
function checkPayment() {
	var hostedPci = false;
	var payPal = false;
	if ($('#id'+STANDARD_FIELD_PAYMENT_METHOD+'_'+PAYMENT_METHOD_PAY_WITH_CREDIT_CARD).is(':checked') && $('#id'+STANDARD_FIELD_PAYMENT_METHOD+'_'+PAYMENT_METHOD_PAY_WITH_CREDIT_CARD).is(':visible')) {
		hostedPci = true;
	} else if ($('#id'+STANDARD_FIELD_PAYMENT_METHOD+'_'+PAYMENT_METHOD_PAY_WITH_PAYPAL).is(':checked') && $('#id'+STANDARD_FIELD_PAYMENT_METHOD+'_'+PAYMENT_METHOD_PAY_WITH_PAYPAL).is(':visible')) {
		payPal = true;
	} else if ($('#hostedpci_script').html() != undefined && $('#hostedpci_script').is(':visible')) {
		hostedPci = true;
	} else if ($('#paypalpaynow_script').html() != undefined && $('#paypalpaynow_script').is(':visible')) {
		payPal = true;
	}
	if (hostedPci) {
		$('input[type="submit"]').attr('disabled', true);
		return sendHPCIMsg();
	} else if (payPal) {
		if (!formSubmitErrorOccurred) {
			$('input[type="submit"]').attr('disabled', true);
		}
		return true;
	}
}

function clickBehavior(elementId) {
	try {
		if (elementId.startsWith("demo")) {
			elementId = elementId.substring(4);
		}
		var url = 'trackClickBehavior.do';
		if (dragonjsessionid != null && dragonjsessionid != '') {
			url = url + ';jsessionid=' + dragonjsessionid;
		}
		var parms = "elementId=" + elementId;
		$.get(url + "?" + parms, "", function (data) {
			//console.log("successful clickBehavior");
		}, "json");
	} catch (err) {
		alert('err=' + err);
	}
}

//Object.entries does not exist on Internet Explorer. This function can be used instead.
function entriesPolyFill(obj) {
    var ownProps = Object.keys( obj ),
    i = ownProps.length,
    resArray = new Array(i); // preallocate the Array
    while (i--) {
    	resArray[i] = [ownProps[i], obj[ownProps[i]]];
    }
    return resArray;
};

function httpPostWithFormData(url, formDataJson) {
	try {
		var form = new FormData();
		var json = JSON.parse(formDataJson);
	
		var entries  = entriesPolyFill(json);
		for (var entry in entries) {
		    if (entries.hasOwnProperty(entry)) {
		    	var tokens = entries[entry];
		    	if (tokens.length > 0) {
		    		var key = tokens[0];
		    		var value = '';
			    	if (tokens.length > 1) {
			    		value = tokens[1];
			    	}
					form.append(key, value);
		    	}
		    }
		}		

		var settings = {
		  "url": url,
		  "method": "POST",
		  "timeout": 0,
		  "processData": false,
		  "mimeType": "multipart/form-data",
		  "contentType": false,
		  "data": form
		};
		
		$.ajax(settings).done(function (response) {
		});		
	} catch (err) {
	}
}

var formInitialLoad = true;
var formSubmitErrorOccurred = false;
var submitButtonSelector = '#submitbtn';
$(document).ready(function () {
	var submitButtons = $('form input[type=submit], form button[type=submit]');
	var onclick = $('#submitbtn').find('input').attr('onclick');
	if (submitButtons.length > 1 || $('#submitbtn').html() == undefined) {
		for (var i = 0; i < submitButtons.length; i++) {
			if ($(submitButtons[i]).parent().attr('id') == 'submitbtn') {
				$('#submitbtn').remove();
			} else {
				if ($(submitButtons[i]).attr('id') == undefined) {
					$(submitButtons[i]).attr('id', 'custombtn');
				}
				submitButtonSelector = '#'+$(submitButtons[i]).attr('id');
			}
		}
		if (onclick != undefined && submitButtonSelector != '#submitbtn') {
			var originalOnclick = $(submitButtonSelector).attr('onclick');
			if (originalOnclick != undefined) {
				if (originalOnclick.indexOf('checkPayment()') == -1) {
					onclick = originalOnclick + ';' + onclick;
				} else {
					onclick = originalOnclick;
				}
			}
			$(submitButtonSelector).attr('onclick', onclick);
		}
	}
});

function calculatePaymentMethod(fieldLastChanged) {
	try {
		var orderIdInput = document.getElementById("paypalOrderId");
		var subscriptionIdInput = document.getElementById("paypalSubscriptionId");
		var paypalSubscribeStepInput = document.getElementById("paypalSubscribeStep");
		$('.payment_method_warning').html('');
		if (fieldLastChanged == null && formInitialLoad) {
			formInitialLoad = false;
			if ($('.validation').find('ul').html() != undefined && $('.validation').find('ul').html().trim() != '') {
				formSubmitErrorOccurred = true;
				$('#paypalpaynow_script').hide();
				$('#paypalsubscribe_script').hide();
			}
		}
		if ($(fieldLastChanged).hasClass('paidElement')) {
			formSubmitErrorOccurred = false;
			if (orderIdInput != undefined) {
				orderIdInput.value = '';
				$('#paypalpaynow_script').show();
				$(submitButtonSelector).hide();
			}
			if (subscriptionIdInput != undefined) {
				subscriptionIdInput.value = '';
				if (payPalPlanId != '') {
					$('#paypalsubscribe_script').show();
					$(submitButtonSelector).hide();
				}
			}
		}
		if ($('#id'+STANDARD_FIELD_PAYMENT_METHOD+'_'+PAYMENT_METHOD_PAY_WITH_CREDIT_CARD).is(':checked')) {
			$('#paypalpaynow_script').hide();
			$('#paypalsubscribe_script').hide();
			$('#hostedpci_script').show();
			$('.drg-element-sub-type-fieldname-CCEXPIRE').show();
			$(submitButtonSelector).show();
		} else if ($('#id'+STANDARD_FIELD_PAYMENT_METHOD+'_'+PAYMENT_METHOD_PAY_WITH_PAYPAL).is(':checked')) {
			if ((payPalPlanId != '' || $('#paypalpaynow_script').html() != undefined) && totalPrice != '' && totalPrice != '0.00') {
				$('#hostedpci_script').hide();
				$('.drg-element-sub-type-fieldname-CCEXPIRE').hide();
				if (!formSubmitErrorOccurred) {
					$(submitButtonSelector).hide();
					$('#paypalpaynow_script').show();
					$('#paypalsubscribe_script').show();
					if (subscriptionIdInput != undefined) {
						subscriptionIdInput.value = '';
					}
				}
			} else {
				$('#paypalpaynow_script').hide();
				$('#paypalsubscribe_script').hide();
				$('#hostedpci_script').show();
				$('.drg-element-sub-type-fieldname-CCEXPIRE').show();
				$(submitButtonSelector).show();
				if (totalPrice != '') {
					$('.payment_method_warning').html('The Pay with PayPal Payment Method is not supported for this transaction.');
				}
			}
		} else if ($('#paypalpaynow_script').html() != undefined && $('#paypalpaynow_script').is(':visible')) {
			if (!formSubmitErrorOccurred) {
				$(submitButtonSelector).hide();
			}
		} else if ($('#paypalsubscribe_script').html() != undefined && $('#paypalsubscribe_script').is(':visible')) {
			if (!formSubmitErrorOccurred && payPalPlanId != '') {
				$(submitButtonSelector).hide();
			}
		} else {
			$(submitButtonSelector).show();
		}
	} catch (err) {
	}
}

function clearOtherPaidElements(changedObject) {
	var selectedName = $(changedObject).attr('name');
	var selectedType = $(changedObject).prop('nodeName').toUpperCase();
	var selectedClasses = '';
	if (selectedType == 'SELECT') {
		selectedClasses = $(changedObject).find('option:selected').attr('class').split(' ');
	} else if (selectedType == 'INPUT') {
		selectedClasses = $(changedObject).attr('class').split(' ');
	}
	for (var i = 0; i < selectedClasses.length; i++) {
		if (selectedClasses[i].startsWith('paidElementProduct')) {
			$("."+selectedClasses[i]).each(function(j) {
				var nodeType = $(this).prop('nodeName').toUpperCase();
				var node = $(this);
				if (nodeType == 'OPTION') {
					node = $(this).parent();
				}
				if ($(node).attr('name') != selectedName) {
					$(node).prop("checked", false);
					$(node).find('option:selected').prop("selected", false);
				}
			});
		}
	}
};