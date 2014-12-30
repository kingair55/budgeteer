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
    $("#" + editEntryModal.id).css("background-color", "#f8d3fa");
    $("#" + editEntryModal.id).css("display", "none");

    $("#deleteEntry").on("click", function () {
        var entryToDelete = $(this).parent().parent();
        $("#editEntryModal").appendTo($("#incomeList"));
        entryToDelete.remove();

        $("#editEntryModal").css("display", "none");
        $("#deleteEntry").css("display", "none");

        UpdateValues();
        updateSavingsTextColor();
    });
});

function UpdateValues() {
    var total = 0;
    $(".incomeInput").each(function () {
        var elem = $(this);
        total += parseInt(elem.val().replace(/[^0-9]/g, ""));
    });
    $("#totalIncomeValue").text("$" + total);
    total = 0;
    $(".expenseInput").each(function () {
        var elem = $(this);
        total += parseInt(elem.val().replace(/[^0-9]/g, ""));
    });
    $("#totalExpenseValue").text("$" + total);
}