//inspired by https://codepen.io/blazicke/pen/bZQxXY
class TodoList {
    constructor(id, title, deadline, tasks = []) {
        this.id = id;
        this.title = title;
        this.tasks = tasks;
        this.deadline = deadline;
        
        this.setupTracker();
    }

    setupTracker() {
        this.displayTasks();

        $('.task-add').on('focus',function() {
            $(this).val('');
        });
    
        $('.task-add').on('blur',function() {
            $(this).val('+ add new task');
        });

        $('#task-form').on('submit', event => this.addNewTask(event));

        if (this.deadline !== null) {
            var oneDay = 24 * 60 * 60 * 1000;
            var goalDate = new Date(this.deadline);
            var goalDateString = goalDate.getDate() + "." + (goalDate.getMonth() + 1) + "." + goalDate.getFullYear();
            var today = Date.now();
            var daysLeft = Math.round(Math.abs((goalDate.getTime() - today) / (oneDay)));
            var realDaysLeft = (goalDate.getTime() - today) / (oneDay);
            
            if(realDaysLeft < 0) {
                $(".progress-bar-deadline").text("Deadline ist abgelaufen!");    
            } else {
                $(".progress-bar-deadline").text("Deadline: " + goalDateString + " (" + daysLeft + " days left)");
            }
        }
    }

    displayTasks() {
        $('.task-list').empty();
        var tasklist = this.tasks;
        for(var i = 0; i < tasklist.length; i++) {
            var task = tasklist[i];
            if(task.status === true) {
                var givenTask = '<label for="task-' + task.id + '" class="task task-new"><div class=" task-field task-row" data-id="'+ task.id +'"><div class="icon icon-checked"></div><span>' + task.name + '</span><div class="icon-trash"></div></div></label>';
            } else {
                var givenTask = '<label for="task-' + task.id + '" class="task task-new"><div class=" task-field task-row" data-id="'+ task.id +'"><div class="icon icon-unchecked"></div><span>' + task.name + '</span><div class="icon-trash"></div></div></label>';
            }
            $('.task-list').append(givenTask);
        };

        this.addTaskListeners();
    }

    addNewTask() {
        event.preventDefault();

        var idTracker = this.id;
        var taskText = $('.task-add').val();

        $.ajax({
            type: "POST", 
            url: "/peppers/" + idTracker+ "/tasks", 
            data: { "task[name]": taskText },
        });
        $('.task-add').val('');
    }

    addTaskListeners() {
        var idTracker = this.id;
        var taskList = this.tasks;

        $('.task').each(function () {
            var $field = $(this).find('.task-field');
            var $deleteButton = $(this).find('.icon-trash');
            var $checkMark = $(this).find('.icon');
            var taskID = $field.data("id");

            //Delete Task
            $deleteButton.on("click", function() {
                $.ajax({
                    type: "DELETE", 
                    url: "/peppers/" + idTracker+ "/tasks/" + taskID + ".json",

                });
                $field.remove();   
            });

            //Change status of Task
            $checkMark.on("click", function() {
                var currentTask = taskList.find(function(element) {
                    return element.id === taskID;
                });

                if(currentTask.status === false) {
                    $.ajax({
                        type: "PATCH", 
                        url: "/peppers/" + idTracker+ "/tasks/" + taskID + ".json",
                        data: { "task[status]": true }
                    });
                    
                    currentTask.status = true;
                    $checkMark.removeClass("icon-unchecked").addClass("icon-checked");
                } else {
                    $.ajax({
                        type: "PATCH", 
                        url: "/peppers/" + idTracker+ "/tasks/" + taskID + ".json",
                        data: { "task[status]": false }
                    });
                    
                    currentTask.status = false;
                    $checkMark.removeClass("icon-checked").addClass("icon-unchecked");
                }
            })
        }); 
    }
}