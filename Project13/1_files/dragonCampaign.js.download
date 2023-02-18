//created by lvinaja
var shippingAddressCountry = "7";
var requestedVersionId = "112";
var campaignRequestedVersionId = "151";
var billMeLaterResponse = "#id27_347[value=347]";
var campaigElementExists = undefined;
$(document).ready(function () {
	if ($("#shippingaddresscountry").val() != undefined && $("#shippingaddresscountry").val() != '') {
		shippingAddressCountry = $("#shippingaddresscountry").val(); 
	}
	campaigElementExists = $("div[id^=campaignPlaceholder_]").length>0 || $("#campaignHtmlContent").length>0;
	if (campaigElementExists){ //on page load
		getPromoContentAndPrices('onPageLoad');
	}
	
	//to trigger tax we need to call change function in conditional.js
    //since the elements are added after the document and element bindings are complete, we do this a little different
	document.addEventListener('click', function(event) {
		if ($(event.target).hasClass("CCprod") || $(event.target).parent().hasClass("CCprod")) {
		    checkConditions($(event.target));
		}
	});
	
	//if no promo prices show at all
	if ($("#campaignPricingSuccess").val()=='true' && $("#isFPromo").val()=='true') {
		$(".spanc27, .spanc104").hide();//hide any BillCode and Auto-Renewal Indicator fields on the page
	}
	if ($("#campaignAutoRenew").val()==1) {
		$(".spanc104").hide();//hide any Auto-Renewal Indicator field on the page since this is automatic
	}
}); //END .ready

function campaignPromocodeChanged(fieldLastChanged) {
	//ajax to update price container if it is on the page
	if (campaigElementExists) {
		getPromoContentAndPrices(fieldLastChanged);
	}
}

//hide options based on country/version
function campaignCountryOrRequestedVersionChanged(fieldLastChanged) {
	if (campaigElementExists) {
	    showHidePromoPrices(fieldLastChanged);
	}
}

function getPromoContentAndPrices(fieldLastChanged) {
	var promo = $("#id49").val();//if promo is on another page we will check the map
	var elementId=0;
	if ($("div[id^=campaignPlaceholder_").length>0) {
		elementId = $("div[id^=campaignPlaceholder_").attr("id").split("_")[1];
	}
	
	var dragonjsessionid = $('#dragonjsessionid').val();
	var url = 'dragonCampaignLookup.do';
	if (dragonjsessionid != null && dragonjsessionid != '') {
		url = url + ';jsessionid=' + dragonjsessionid;
	}
	$.ajax({
	    url : url,
	    type : 'GET',
	    data : {
	        'promoFromPage' : promo,
	        'elementId' : elementId
	    },
	    success : function(response) {
	    	if (response!==undefined) { //avoid console errors when this doesn't apply
		    	var htmlArray = response.split("}}");
		    	if (htmlArray.length>3 && (htmlArray[2]!="" || htmlArray[3]!="")) {
			    	var elArray = htmlArray[1].split(",");
	
		    		//make sure there is actual paid content in response before hiding default paid
			    	if (elementId>0 && htmlArray[3].indexOf("questionlabel")>0) {
			    		for (var i=0; i<elArray.length; ++i) {
			    			var id = elArray[i];
			    			$(".spanc"+id).hide(); //hide dragon paid content
			    			$("#p"+id+" ul li input:checked").attr('checked',false);
			    		}
			    	}
			        $("#campaignPlaceholder_"+elementId).html(htmlArray[3]);
			        $("#campaignHtmlContent").html(htmlArray[2]);
			        $("#campaignAutoRenew").val(htmlArray[0]);
		        	//if we are foring auto-renewal, then hide that field
			        if (htmlArray[0]==1) {
			        	$("#id104:checked").attr('checked',false);
			        	$(".spanc104").hide();
			        }
		        	//bill me not allowed so hide the option
			        if (htmlArray[4]=='false') {
			        	$(billMeLaterResponse).removeAttr("checked");
			        	$(billMeLaterResponse).parent().hide();
			        } else {
			        	$(billMeLaterResponse).parent().show();
			        }
			        checkConditions($("#clearPrices"));
			        showHidePromoPrices(fieldLastChanged);
		    	} else {
		    		hidePromoPrices(fieldLastChanged);
		    	}
	    	} else {
	    		//if response is null then a promo w no content/prices was entered so remove any prices that might have been showing
	    		hidePromoPrices(fieldLastChanged);
	    	}
	    },
	    error:function(jqXHR, textStatus, message) {
	    	$("#campaignHtmlContent").html("");
	    	$(".paidElement").show();
	    	$(billMeLaterResponse).parent().show();
	        showHidePromoPrices(fieldLastChanged);
	    }
	});
}

function hidePromoPrices(fieldLastChanged) {
	$("div[id^=campaignPlaceholder_]").html("");
	$("#campaignHtmlContent").html("");
	showHidePromoPrices(fieldLastChanged);
	showDragonPaidContent();
}

function showDragonPaidContent() {
	$(".paidElement").closest("span").show(); //show dragon paid content instead of campaign paid content
	$(billMeLaterResponse).parent().show();
}

function hideDragonPaidContent() {
	$(".paidElement").closest("span").hide(); //hide dragon paid content because campaign paid content is shown
}

function showHidePromoPrices(fieldLastChanged) {
	var campaignOptionCount = $('.CCprod').length;
	//clear promo responses so we don't clear validation with a selection from a hidden and invalid option
	$(".CCprod").removeAttr('checked').hide(); //radios
	$(".CCprod input").removeAttr('checked');
	$("option.CCprod").removeAttr('selected').hide();
	
	var selectedVersion = $("input[id^=id"+campaignRequestedVersionId+"]:checked:visible").val();
	if ((selectedVersion == '' || selectedVersion == undefined) && $("#id"+campaignRequestedVersionId).is("select")) {
		selectedVersion = $("#id"+campaignRequestedVersionId+" option:selected").val();
	/*} else if (selectedVersion == undefined && $("#versionFromMap").val()!='' && $("#versionFromMap").val()!=undefined) {
		selectedVersion = $("#versionFromMap").val();*/
	}
	if (selectedVersion == '' || selectedVersion == undefined) {
		selectedVersion = "1001"; //no preference triggers show all responses for campaign promocode
	}
	var selectedCountry = $("#id" + shippingAddressCountry + " option:selected").val();
	if (selectedCountry == undefined && $("#countryFromMap").val()!='') {
		selectedCountry = $("#countryFromMap").val();
	}
	var isBillMe = $("#id27_347 option:selected").val()=="347";
	if (isBillMe == '' || isBillMe == undefined) {
		isBillMe = $("#id27_347:checked").val()=="347";
	}
	
	var countryClass = "";
	if (selectedCountry=='80' || selectedCountry=='2021') { //USA
		countryClass = "USAprod";
	} else if (selectedCountry=='81' || selectedCountry=='2022') { //Canada
		countryClass = "CANprod";
	} else if (selectedCountry=='231' || selectedCountry=='2150') { //Mexico
		countryClass = "MEXprod";
	} else if (selectedCountry!='' && selectedCountry!=undefined) {
		countryClass = "INTprod";
	}
	
	var versionClass = "";
	if (selectedVersion=='998' || selectedVersion=='2015') { //print
		versionClass = "Pprod";
	} else if (selectedVersion=='999' || selectedVersion=='2016') { //digital
		versionClass = "Dprod";
	} else if (selectedVersion=='1000' || selectedVersion=='2017') { //both
		versionClass = "Bprod";
	} else if (selectedVersion=='1001' || selectedVersion=='2018') { //No Preference
		versionClass = "showAll";
	} else if (selectedVersion=='1003' || selectedVersion=='2019' || isBillMe) { //Don't Want OR Bill Me is selected
		versionClass = "hideAll";
	}
	if ((versionClass == "showAll" && (selectedCountry=='' || selectedCountry==undefined)) ) {
		$("span[class^=spanc114_]").show();
		$("span[class^=spanc114_] div").show(); //in case this is a select
		$("li.CCprod, li.CCprod input").show();
		$("option.CCprod").show();
		
		//clear non-promo paid element selections
		if (campaignOptionCount > 0) {
			$(".paidElement").removeAttr("selected").removeAttr("checked");
			$("#id64,#id62,#id63").val("0.00"); //clear any tax/subtotal/total fields - this gets replaced by conditional.js anyways
		}
	} else if (versionClass == "hideAll") {
		$("span[class^=spanc114_], span[class^=spanc114_] div").hide();
	} else if (selectedCountry!='' && versionClass == "showAll") {
		//there is no selected version - just use version from promo
		$("span[class^=spanc114_], span[class^=spanc114_] div").show(); //show everything at first

		//clear non-promo paid element selections if campaign pricing is on the page
		if ($("li.CCprod input:checked").length>0) {
			$(".paidElement").removeAttr("selected").removeAttr("checked");
			$("#id64,#id62,#id63").val("0.00"); //clear any tax/subtotal/total fields
		}
		
		if ($("#id114").is("select")) { //select
//			$("#id114").addClass("required");
			$("option.CCprod").each(function(){
				if ($(this).hasClass(countryClass) || $(this).hasClass("ALLprod"))
					$(this).show();
			});
		} else { //radios
			$(".CCprod").each(function(){
				if ($(this).hasClass(countryClass) || $(this).hasClass("ALLprod")) {
					$(this).show();
				}
			});
		}
	} else {
		$(".paidElement").removeAttr("selected").removeAttr("checked");//clear non-campaign price selections
		$("#id64,#id62,#id63").val("0.00"); //clear any tax/subtotal/total fields
		if ($("#id114").is("select")) { //select
//			$("#id114 optgroup").show(); //might help with Combo selects
			$("option.CCprod").each(function(){
				if (versionClass=='') {
					if ($(this).hasClass(countryClass) || $(this).hasClass("ALLprod"))
						$(this).show();
				} else if (countryClass=='') {
					if ($(this).hasClass(versionClass))
						$(this).show();
				} else {
					if ( ($(this).hasClass(countryClass) || $(this).hasClass("ALLprod")) && ($(this).hasClass(versionClass) || $(this).hasClass("anyRVprod")) )
						$(this).show();
				}
			});
		} else { //radios
			$("span[class^=spanc114_], span[class^=spanc114_] div").show(); //show everything at first
			if (versionClass == "" && (selectedCountry=='' || selectedCountry==undefined)) {
				$("span[class^=spanc114_], span[class^=spanc114_] div").hide(); //hide everything because not enough information to determine which campaign responses to show	
			}
			$(".CCprod").each(function(){
				if (countryClass=='') {
					if ($(this).hasClass(versionClass)) {
						$(this).show();
					}
				} else {
					if ( ($(this).hasClass(countryClass) || $(this).hasClass("ALLprod")) && ($(this).hasClass(versionClass) || $(this).hasClass("anyRVprod")) ) {
						$(this).show();
					}
				}
			});
		}
	}
	
	//if no prices are showing ever, then also hide all product descriptions (but not bill me)
	$(".spanc"+requestedVersionId).show();
	$(".CCprod, option.CCprod").each(function(){
		var classArray = $(this).attr("class").split(" ");
		var noVisibleCampaignPrices = false;
		for (var i=0; i<classArray.length; ++i) {
			if (classArray[i].indexOf("group")>=0) {
				if ($("#id114").is("select") && $("option."+classArray[i]+"[style='display: block;']").length<1) { //drop-down
//					$("option."+classArray[i]).parent("optgroup:first").hide(); //might help with Combo selects
					$(".spanc114_"+classArray[i].replace("group","")).hide();
					noVisibleCampaignPrices = true;
				}
				else if ($("."+classArray[i]+":visible").length<1) { //radios
//					$("li."+classArray[i]).prevAll("div:first").hide();
					//if this parent element is not visible then a condition is hiding the pricing and not campaign logic. we can let that drive the show hiding instead
					if ($("div[id^=campaignPlaceholder_]").parent().is(":visible")) {
						$(".spanc114_"+classArray[i].replace("group","")).hide();
						noVisibleCampaignPrices = true;
					}
				}
			}
		}
		if (noVisibleCampaignPrices) {
			if (campaignOptionCount == 0) {
				showDragonPaidContent();
			} else {
				if (fieldLastChanged != undefined) {
					var fieldLastChangedId = $(fieldLastChanged).attr('id');
					if (fieldLastChangedId != undefined || fieldLastChanged == 'onPageLoad') {
						if (fieldLastChanged == 'onPageLoad' || //page loaded
								fieldLastChangedId == 'id49' || //promo code
								fieldLastChangedId == 'id7' || //business country
								fieldLastChangedId.startsWith('id158')) { //residential country
							//popup modal to allow customer to clear the promocode
							$("#basicConfirmMessage").html("This Promocode Offer is not available for the selected Country.  Would you like to remove this Promocode?");
							$("#basicConfirm_modal").show();
					        $(".basicConfirmYes").unbind( "click");
					        $(".basicConfirmYes").bind( "click", function() {
					            $("#basicConfirm_modal").hide();
					            changePromocode();
					        });        
					        $(".basicConfirmNo").unbind( "click");
					        $(".basicConfirmNo").bind( "click", function() {
					            $("#basicConfirm_modal").hide();
								getPromoContentAndPrices();
					        });        
						}
					}
				}
				$(".spanc"+requestedVersionId).hide(); //need these
			}
		} else {
			hideDragonPaidContent();
			$(".spanc"+requestedVersionId).hide(); //need these
		}
	});

	function changePromocode() {
		var url = 'changePromocode.do';
		$.ajax({
		    url : url,
		    type : 'GET',
		    data : {},
		    success : function(response) {
		    	if (response!==undefined) {
		    		if (response.backupPromocode !== undefined) {
			            $("#id49").val(response.backupPromocode);
		    		} else {
			            $("#id49").val("");
		    		}
					getPromoContentAndPrices();
		    	}
		    },
		    error:function(jqXHR, textStatus, message) {
		    }
		});
	}
}