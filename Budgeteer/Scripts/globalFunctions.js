function updateSavingsTextColor() {
    var income = parseInt($("#" + "totalIncomeValue").text().replace(/[^0-9]/g, ""));
    var expense = parseInt($("#" + "totalExpenseValue").text().replace(/[^0-9]/g, ""));
    var savings = income - expense;
    $("#" + "savingsValue").text("$" + savings + "");

    if (savings > 0)
        $("#" + "savingsValue").css("color", "#37ad15");
    else if (savings == 0)
        $("#" + "savingsValue").css("color", "black");
    else
        $("#" + "savingsValue").css("color", "red");
}

function hasProperty(object) {
    for (var prop in object) {
        return true;
    }
    return false;
}

function getElementCountByClass(elementClass) {
    return count = $(elementClass).length;
}

$(document).ready(function () {
    var editEntryModal = document.createElement("div");
    editEntryModal.id = "editEntryModal";
    document.getElementById("incomeList").appendChild(editEntryModal);

    var deleteEntry = document.createElement("input");
    deleteEntry.id = "deleteEntry";
    deleteEntry.type = "button";
    deleteEntry.value = "Delete";

    document.getElementById(editEntryModal.id).appendChild(deleteEntry);
    $("#" + editEntryModal.id).css("width", "150px");
    $("#" + editEntryModal.id).css("height", "50px");
    $("#" + editEntryModal.id).css("background-color", "#ffffff");
    $("#" + editEntryModal.id).css("display", "none");

    $("#deleteEntry").on("click", function () {
        var entryToDelete = $(this).parent().parent();
        $("#editEntryModal").appendTo($("#incomeList"));
        entryToDelete.remove();

        $("#editEntryModal").css("display", "none");
        $("#deleteEntry").css("display", "none");

        UpdateValues();
        updateSavingsTextColor();
        ReSequenceEntryLabelAndInputIdIndex();
    });
});

function UpdateValues() {
    var total = 0;
    $(".incomeInput").each(function () {
        var elem = $(this);
        total += parseInt(elem.val().replace(/[^0-9]/g, "")) || 0;
    });
    $("#totalIncomeValue").text("$" + total);
    total = 0;
    $(".expenseInput").each(function () {
        var elem = $(this);
        total += parseInt(elem.val().replace(/[^0-9]/g, "")) || 0;
    });
    $("#totalExpenseValue").text("$" + total);
}

function ReSequenceEntryLabelAndInputIdIndex() {
    var index = 1;
    $(".incomeEntry").each(function () {
        this.id = this.id.replace(/[0-9]/g, "") + index;
        index++;
    });
    index = 1;
    $(".incomeType").each(function () {
        this.id = this.id.replace(/[0-9]/g, "") + index;
        index++;
    });
    index = 1;
    $(".incomeInput").each(function () {
        this.id = this.id.replace(/[0-9]/g, "") + index;
        index++;
    });
    index = 1;
    $(".expenseEntry").each(function () {
        this.id = this.id.replace(/[0-9]/g, "") + index;
        index++;
    });
    index = 1;
    $(".expenseType").each(function () {
        this.id = this.id.replace(/[0-9]/g, "") + index;
        index++;
    });
    index = 1;
    $(".expenseInput").each(function () {
        this.id = this.id.replace(/[0-9]/g, "") + index;
        index++;
    });
}

function SetCssOnMouseover(elem) {
    $(elem).css("display", "block");
    $(elem).css("width", "70px");
    $(elem).css("height", "30px");
    $(elem).css("margin-top", "10px");
    $(elem).css("margin-left", "40px");
    $(elem).css("margin-right", "40px");
    $(elem).css("font-size", "16px");
    $(elem).css("font-family", "Segoe UI");
    $(elem).css("background-color", "#f6f6f6");
    $(elem).css("border", "none");
}

function AttachMonthListDiv(elem) {
    var newDiv = document.createElement("div");
    newDiv.className = "monthListDiv";
    $(newDiv).insertAfter($(elem));
}

//$("#monthDiv").click(AttachMonthListDiv(this));

$("#monthDiv").click(function () {
    var newDiv = document.createElement("div");
    $(newDiv).addClass("monthListDiv");
    $(newDiv).appendTo(this);
});