/*
 * @author Shaumik "Dada" Daityari
 * @copyright December 2013
 */

/* Some info
Using newer versions of jQuery and jQuery UI in place of the links given in problem statement
All data is stored in local storage
User data is extracted from local storage and saved in variable todo.data
Otherwise, comments are provided at appropriate places
*/
// nhận dữ liệu 
var todo = todo || {},
    data = JSON.parse(localStorage.getItem("todoData")); // dữ liệu được lưu trữ

data = data || {};
(function(todo, data, $) {
    // khai báo đối tượng javascript
    var defaults = {
            todoTask: "todo-task",
            todoHeader: "task-header",
            todoDate: "task-date",
            todoDescription: "task-description",
            todoCreator: "task-creator",

            taskId: "task-",
            formId: "todo-form",
            dataAttribute: "data",
            deleteDiv: "delete-div"
        }, codes = { // khai báo đối tượng JSON
            "1" : "#pending",
            "2" : "#inProgress",
            "3" : "#completed"
        };

    todo.init = function (options) {

        options = options || {};
        options = $.extend({}, defaults, options);

        $.each(data, function (index, params) {
            generateElement(params); // tạo phần tử
        });

        // Adding drop function to each category of task
        $.each(codes, function (index, value) {
            $(value).droppable({ // thả phần tử HTML vào mục bất kỳ mục nào
                drop: function (event, ui) {
                        var element = ui.helper,
                            css_id = element.attr("id"),
                            id = css_id.replace(options.taskId, ""),
                            object = data[id];
                            // Removing old element 
                            removeElement(object);
                            // Changing object code gán index cho object.code
                            object.code = index;
                            // Generating new element
                            generateElement(object);
                            // Updating Local Storage lưu trữ object vào mảng
                            data[id] = object;
                            localStorage.setItem("todoData", JSON.stringify(data));
                            // Hiding Delete Area
                            $("#" + defaults.deleteDiv).hide();
                    }
            });
        });

        // Adding drop function to delete div
        $("#" + options.deleteDiv).droppable({ // xóa phần tử cũ sau khi thả
            drop: function(event, ui) {
                var element = ui.helper,
                    css_id = element.attr("id"),
                    id = css_id.replace(options.taskId, ""),
                    object = data[id];
                // Removing old element
                removeElement(object);
                // Updating local storage
                delete data[id];
                localStorage.setItem("todoData", JSON.stringify(data));
                // Hiding Delete Area
                $("#" + defaults.deleteDiv).hide();
            }
        })
    };

    // Add Task
    var generateElement = function(params){
        var parent = $(codes[params.code]),
            wrapper;
        // khai báo ngày giờ hiện tại
        var d = new Date();
        var month = d.getMonth() +1;
        var date = d.getDate() + "/" + month + "/" + d.getFullYear();
        var overDueClass = "";
        if (!parent) {
            return;
        }
        console.log(params.date);
        // kiểm tra ngày nhập, nếu ngày nhập sớm hơn ngày hiện tại thì true.
        if(params.date < date)
        {
            overDueClass = "overdue";
        }
        else
        {
            everDueClass = "";
        }
        wrapper = $("<div />", {
            "class" : defaults.todoTask + " " + overDueClass,
            "id" : defaults.taskId + params.id,
            "data" : params.id
        }).appendTo(parent);
        // add your code here
        // chèn trường dữ liệu todoHeader vào wrapper
        $("<div />", {
            "class": defaults.todoHeader,
            "text": params.title
        }).appendTo(wrapper);
        // chèn trường dữ liệu todoDescription vào wrapper
        $("<div />", {
            "class": defaults.todoDescription,
            "text": params.description
        }).appendTo(wrapper);
        // chèn trường dữ liệu todoCreator vào wrapper
        $("<div />", {
            "class": defaults.todoCreator,
            "text": params.creator
        }).appendTo(wrapper);
        // chèn trường dữ liệu todoDate vào wrapper
        $("<div />", {
            "class": defaults.todoDate,
            "text": params.date
        }).appendTo(wrapper);
        // tiêu đề thu gọn và mở nhiều nội dung khi nhấp vào.
        $("#" + defaults.taskId + params.id).on('click','.task-header',function() {
            $(this).toggleClass("active").nextAll().slideToggle(); // thêm( xóa), chọn tất cả, kéo lên(xuống)
        });
        // thêm phần kéo bắt đầu vầ kết thúc
	    wrapper.draggable({
            // add code to implement drag and drop 
            start: function() {
                $("#" + defaults.deleteDiv).show();
            },
            stop: function() {
                $("#" + defaults.deleteDiv).hide();
            },
            revert: "invalid",
            revertDuration : 200
        });
    };
    // Remove task
    var removeElement = function (params) {
        $("#" + defaults.taskId + params.id).remove();
    };
    todo.add = function() {
        var inputs = $("#" + defaults.formId + " :input"),
            errorMessage = "Title can not be empty",
            id, title, description, date, tempData, creator;
        if (inputs.length !== 5) {
            return;
        }

        title = inputs[0].value;
        description = inputs[1].value;
        date = inputs[2].value;
        creator = inputs[3].value;

        if (!title) {
            generateDialog(errorMessage);
            return;
        }

        id = new Date().getTime();
        // khai báo đối tượng
        tempData = {
            id : id,
            code: "1",
            title: title,
            date: date,
            description: description,
            creator: creator
        };
        // Saving element in local storage
        data[id] = tempData;
        //add code to save data in local storage here
        localStorage.setItem("todoData", JSON.stringify(data));
        // Generate Todo Element
        generateElement(tempData);
        // Reset Form
        inputs[0].value = "";
        inputs[1].value = "";
        inputs[2].value = "";
        inputs[3].value = "";
    };

    var generateDialog = function (message) {
        var responseId = "response-dialog",
            title = "Messaage",
            responseDialog = $("#" + responseId),
            buttonOptions;

        if (!responseDialog.length) {
            responseDialog = $("<div />", {
                    title: title,
                    id: responseId
            }).appendTo($("body"));
        }

        responseDialog.html(message);

        buttonOptions = {
            "Ok" : function () {
                responseDialog.dialog("close");
            }
        };

	    responseDialog.dialog({
            autoOpen: true,
            width: 400,
            modal: true,
            closeOnEscape: true,
            buttons: buttonOptions
        });
    };

    todo.clear = function () {
        data = {};
        localStorage.setItem("todoData", JSON.stringify(data));
        $("." + defaults.todoTask).remove();
    };

})(todo, data, jQuery);