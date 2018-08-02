$.mobile.document
    .on("selectmenucreate", ".filterable-select", function (event) {
        var input,
            selectmenu = $(event.target),
            list = $("#" + selectmenu.attr("id") + "-menu"),
            form = list.jqmData("filter-form");

        if (!form) {
            input = $("<input data-type='search'></input>");
            form = $("<form></form>").append(input);
            input.textinput();
            list
                .before(form)
                .jqmData("filter-form", form);
            form.jqmData("listview", list);
        }

        selectmenu
            .filterable({
                input: input,
                children: "> option[value]"
            })

            .on("filterablefilter", function () {
                selectmenu.selectmenu("refresh");
            });
    })



function changeFunc() {
    var selectBox = document.getElementById("filter");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    alert(selectedValue);
}

function getAllItems() {
    alert("in getAllItems function");
    $.ajax({
        contentType: JSON,
        url: "https://manageitemlist.azurewebsites.net/api/GetAllItems?code=Ws3K2/EREH0e34YfpzH12ptdVNWbAjwTV/B7cSsV8L6RHOgetOkTCA==",
        type: "GET",
        error: function () { alert('an error occured please try again later'); },
        success: function (data) {
            if (data.includes("error")) {
                //error
            }
            else {
                listItems = document.getElementById("filter");
                items = data.split("|");
                items.forEach(function (item) {
                    listItem.innerHTML = listItem.innerHTML + "<option value=\"" + item + "\" data-filtertext=\"" + item + "\">" + item + "</option>";
                })
            }
        }
    });
}