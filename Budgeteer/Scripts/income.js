var suggestionListIncome = [];
var listCreatedIncome = false;
var labelToUpdateIncome = "";

$("#addIncome").click(function () {
    var linebreak = document.createElement("br");
    var newLabel = document.createElement("label");
    var newInput = document.createElement("input");
    var elementCount = getElementCountByClass(".incomeType");
    newLabel.id = "incomeLabel" + (parseInt(elementCount) + parseInt("1"));
    newLabel.className = "incomeType";
    newLabel.innerText = "Click to edit";
    newInput.id = "incomeField" + (parseInt(elementCount) + parseInt("1"));
    newInput.className = "incomeInput";
    newInput.type = "text";
    newInput.value = "Income";

    document.getElementById("incomeList").appendChild(linebreak);
    document.getElementById("incomeList").appendChild(newLabel);
    document.getElementById("incomeList").appendChild(newInput);

    var temp = newInput.id;
    var elem = $("#"+temp);
    elem.data("oldValue", elem.val());
    elem.on("propertychange change click keyup input paste", function (event) {
        if (elem.data("oldValue") != elem.val()) {
            var total = parseInt($("#totalIncomeValue").text().replace(/[^0-9]/g, "")) || 0;
            total = (total - (parseInt(elem.data("oldValue")) || 0)) + (parseInt(elem.val()) || 0);
            elem.data("oldValue", elem.val());
            $("#totalIncomeValue").text(total);
        }
    });
});

$(document).on("click", "label.incomeType", function () {
    var txt = $(this).text();
    labelToUpdateIncome = $(this).attr("id");
    $(this).replaceWith("<input class=\"tempClassIncome\" />");
    jsInjectionIncome();
    $("input.tempClassIncome").val(txt);
    $("input.tempClassIncome").focus().select();
});

$(document).on("blur", "input.tempClassIncome", function () {
    $("#listSuggestionIncome").remove();
    listCreatedIncome = false;
    var txt = $(this).val();
    var elementCount = getElementCountByClass(".incomeType");
    $(this).replaceWith("<label " + "id=\"" + labelToUpdateIncome +  "\" " + "class=\"tempClassIncome\"></label>");

    if(txt != "")
        $("label.tempClassIncome").text(txt);
    else
        $("label.tempClassIncome").text("Click to edit");

    if ($("label.tempClassIncome").text() != "Click to edit") {
        suggestionListIncome[suggestionListIncome.length] = $("label.tempClassIncome").text();
    }
    $("label.tempClassIncome").removeClass("tempClassIncome").addClass("incomeType");
    labelToUpdateIncome = "";
});

$(".incomeInput").each(function () {
    var elem = $(this);
    elem.data("oldValue", elem.val());

    elem.on("propertychange change click keyup input paste", function (event) {
        if (elem.data("oldValue") != elem.val()) {
            var total = parseInt($("#totalIncomeValue").text().replace(/[^0-9]/g, "")) || 0;
            total = (total - (parseInt(elem.data("oldValue")) || 0)) + (parseInt(elem.val()) || 0);
            elem.data("oldValue", elem.val());
            $("#totalIncomeValue").text(total);
        }
    });
});

function jsInjectionIncome() {
    $("input.tempClassIncome").on("keyup", function () {
        var theField = $(this);
        if (theField.val().length > 2 && suggestionListIncome.length > 0) {
            if (!listCreatedIncome) {
                theField.after("<ul id=\"listSuggestionIncome\"></ul>");
                listCreatedIncome = true;
            }
            var theList = $("#listSuggestionIncome");
            theList.empty();

            for (i = 0; i < suggestionListIncome.length; i++) {
                var word = suggestionListIncome[i];
                if (word.toLowerCase().indexOf(theField.val()) > -1) {
                    theList.append("<li class=\"wordsIncome\">" + word + "</li>");
                }
            }

            if (theList.children("li").length == 0) {
                theList.remove();
                listCreatedIncome = false;
            }
        } else {
            $("#listSuggestionIncome").remove();
            listCreatedIncome = false;
        }
    });
}

function getElementCountByClass(elementClass){
    return count = $(elementClass).length;
}