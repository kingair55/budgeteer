var suggestionListExpense = Object.create(null);
var listCreatedExpense = false;
var labelToUpdateExpense = "";
var newlyCreatedLabelExpense;
var lastHoveredListItemTextExpense = "";
var timeoutExpense;

$("#addExpense").click(function () {
    var linebreak = document.createElement("br");
    var newDiv = document.createElement("div");
    var newLabel = document.createElement("label");
    var newInput = document.createElement("input");
    var elementCount = (parseInt(getElementCountByClass(".expenseType")) + parseInt("1"));
    newDiv.id = "expenseDiv" + elementCount;
    newDiv.className = "expenseEntry";
    newLabel.id = "expenseLabel" + elementCount;
    newLabel.className = "expenseType";
    newLabel.innerText = "Click to edit";
    newInput.id = "expenseField" + elementCount;
    newInput.className = "expenseInput";
    newInput.type = "text";
    newInput.value = "Expense";

    document.getElementById("expenseList").appendChild(newDiv);
    document.getElementById(newDiv.id).appendChild(newLabel);
    document.getElementById(newDiv.id).appendChild(newInput);

    $("#" + newDiv.id).css("background-color", "#cee7fa");

    var temp = newInput.id;
    var elem = $("#"+temp);
    elem.data("oldValue", elem.val());
    elem.on("propertychange change click keyup input paste", function (event) {
        if (elem.data("oldValue") != elem.val()) {
            var total = parseInt($("#totalExpenseValue").text().replace(/[^0-9]/g, "")) || 0;
            total = (total - (parseInt(elem.data("oldValue")) || 0)) + (parseInt(elem.val()) || 0);
            elem.data("oldValue", elem.val());
            $("#totalExpenseValue").text("$" + total);
        }
    });

    elem.on("click", function () {
        $(this).focus().select();
    });

    elem.on("blur", function () {
        updateSavingsTextColor();
    });

    timeoutExpense = setTimeout(function () {
        $("#"+newDiv.id).css("background-color", "white");
    }, 5000);

    $(".expenseEntry").on("mouseover", function () {
        $("#editEntryModal").appendTo(this);
        $("#editEntryModal").css("display", "block");
        $("#editEntryModal").css("float", "right");

        $("#deleteEntry").appendTo($("#editEntryModal"));
        $("#deleteEntry").css("display", "block");
    });

    $(".expenseEntry").on("mouseout", function () {
        $("#editEntryModal").css("display", "none");
        $("#deleteEntry").css("display", "none");
    });

    AddEntry();
});

function AddEntry() {
    var url = "/Home/AddEntry";
    $.post(url, { type: "", name: "", value: 0, month: 0, year: 0 });
}

$(document).on("click", "label.expenseType", function () {
    var txt = $(this).text();
    labelToUpdateExpense = $(this).attr("id");
    $(this).replaceWith("<input class=\"tempClassEntryExpenseLabel\" />");
    setCssOnTempEntryExpenseLabel();
    jsInjectionExpense();
    $("input.tempClassEntryExpenseLabel").val(txt);
    $("input.tempClassEntryExpenseLabel").focus().select();
});

$(document).on("blur", "input.tempClassEntryExpenseLabel", function () {
    $("#listSuggestionExpense").remove();
    listCreatedExpense = false;
    var txt = $(this).val();
    var elementCount = getElementCountByClass(".expenseType");
    $(this).replaceWith("<label " + "id=\"" + labelToUpdateExpense + "\" " + "class=\"tempClassEntryExpenseLabel\"></label>");

    var newLabel = $("label.tempClassEntryExpenseLabel");

    if (txt != "") {
        if (lastHoveredListItemTextExpense == "")
            newLabel.text(txt);
        else
            newLabel.text(lastHoveredListItemTextExpense);
    }
    else
        newLabel.text("Click to edit");

    if (newLabel.text() != "Click to edit" && !(newLabel.text() in suggestionListExpense)) {
        suggestionListExpense[newLabel.text()] = newLabel.text();
    }

    newLabel.removeClass("tempClassEntryExpenseLabel").addClass("expenseType");

    labelToUpdateExpense = "";
    newlyCreatedLabelExpense = newLabel;
    lastHoveredListItemTextExpense = "";
});

$(".expenseInput").each(function () {
    var elem = $(this);
    elem.data("oldValue", elem.val());

    elem.on("propertychange change click keyup input paste", function (event) {
        if (elem.data("oldValue") != elem.val()) {
            var total = parseInt($("#totalExpenseValue").text().replace(/[^0-9]/g, "")) || 0;
            total = (total - (parseInt(elem.data("oldValue")) || 0)) + (parseInt(elem.val()) || 0);
            elem.data("oldValue", elem.val());
            $("#totalExpenseValue").text("$" + total);
        }
    });
});

function jsInjectionExpense() {
    $("input.tempClassEntryExpenseLabel").on("keyup", function () {
        var theField = $(this);
        if (theField.val().length > 2 && hasProperty(suggestionListExpense)) {
            if (!listCreatedExpense) {
                theField.after("<ul id=\"listSuggestionExpense\"></ul>");
                listCreatedExpense = true;
            }
            var theList = $("#listSuggestionExpense");
            theList.empty();

            for (var key in suggestionListExpense) {
                if (key.toLowerCase().indexOf(theField.val()) > -1) {
                    theList.append("<li class=\"wordsExpense\">" + key + "</li>");
                }
            }

            if (theList.children("li").length == 0) {
                theList.remove();
                listCreatedExpense = false;
            }
            else {
                $(document).on("mouseover", ".wordsExpense", function () {
                    lastHoveredListItemTextExpense = this.innerText;
                });
                $(document).on("mouseout", ".wordsExpense", function () {
                    lastHoveredListItemTextExpense = "";
                });
            }
        } else {
            $("#listSuggestionExpense").remove();
            listCreatedExpense = false;
        }
    });
}

$(".expenseInput").on("click", function () {
    $(this).focus().select();
});

$(".expenseInput").on("blur", function () {
    updateSavingsTextColor();
});

$(".expenseEntry").on("mouseover", function () {
    var modal = $("#editEntryModal");
    modal.appendTo(this);
    modal.css("display", "block");
    modal.css("float", "right");

    var deleteEntry = $("#deleteEntry");
    deleteEntry.appendTo(modal);
    SetCssOnMouseover(deleteEntry);
});

$(".expenseEntry").on("mouseout", function () {
    $("#editEntryModal").css("display", "none");
    $("#deleteEntry").css("display", "none");
});

function setCssOnTempEntryExpenseLabel() {
    $(".tempClassEntryExpenseLabel").css("width", "186px");
    $(".tempClassEntryExpenseLabel").css("height", "26px");
    $(".tempClassEntryExpenseLabel").css("display", "block");
    $(".tempClassEntryExpenseLabel").css("margin-top", "12px");
    $(".tempClassEntryExpenseLabel").css("margin-right", "10px");
    $(".tempClassEntryExpenseLabel").css("float", "left");
    $(".tempClassEntryExpenseLabel").css("font-size", "18px");
    $(".tempClassEntryExpenseLabel").css("font-family", "Segoe UI");
}