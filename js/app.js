$(function() {

    let model = {
        allMissed: [],

        init: function() {
            /* Create an initial
             * attendance record if one is not found
             * within localStorage.
             */
            if (!localStorage.attendance) {

                let getRandom = function() {
                    return (Math.random() >= 0.5);
                };

                var nameColumns = [
                        'Slappy the Frog',
                        'Lilly the Lizard',
                        'Paulrus the Walrus',
                        'Gregory the Goat',
                        'Adam the Anaconda'
                    ],
                    attendance = {};

                nameColumns.forEach(function(name) {
                    attendance[name] = [];

                    for (var i = 0; i <= 11; i++) {
                        attendance[name].push(getRandom());
                    }
                });

                localStorage.attendance = JSON.stringify(attendance);
            }
        },

        updateAttendance: function(newAttendance) {
            localStorage.attendance = JSON.stringify(newAttendance);
        },

        getAttendance: function() {
            return JSON.parse(localStorage.attendance);
        }
    };

    let octapus = {
        init: function() {
            model.init();
            this.countMissing();
            view.init();
        },

        countMissing: function() {
            let index = 0;
            $.each(model.getAttendance(), function(name, days) {
                var numMissed = 0;

                for (let i = 0; i < days.length; i++) {
                    if (!days[i]) {
                        numMissed++;
                    }
                }

                model.allMissed[index] = numMissed;
                index++;
            });
        },

        getMissing: function() {
            return model.allMissed;
        },

        attendanceChange: function(e) {
            let checkBox = e.target;
            let checkBoxIndex = checkBox.parentElement.cellIndex;
            let studentName = checkBox.parentElement.parentElement.firstChild.innerText;
            let attendance = model.getAttendance();
            attendance[studentName][checkBoxIndex - 1] = checkBox.checked;

            model.updateAttendance(attendance);
            this.countMissing();
            view.render();
        },

        getAttendance: function() {
            return model.getAttendance();
        }

    };

    let view = {
        init: function() {
            var attendance = octapus.getAttendance();

            var $headerLastCol = $('th.missed-col');

            for (let i = 1; i <= 12; i++) {
                let column = document.createElement('th');
                column.innerText = i;
                $headerLastCol.before(column);
            }

            var $studentRows = $('.student-rows');

            $.each(attendance, function(name, days) {

                let row = document.createElement('tr');
                row.className = 'student';
                $studentRows.append(row);

                let column = document.createElement('td');
                column.className = 'name-col';
                column.innerText = name;
                row.appendChild(column);

                days.forEach(function(day) {

                    let column = document.createElement('td');
                    column.className = 'attend-col';
                    column.innerHTML = '<input type="checkbox">';
                    column.children[0].checked = day;
                    row.appendChild(column);
                });

                column = document.createElement('td');
                column.className = 'missed-col';

                column.innerText = 0;

                row.appendChild(column);
            });

            let $allCheckboxes = $('tbody input');

            $allCheckboxes.on('click', function(e) {
                octapus.attendanceChange(e);
            });

            this.$allMissed = $('tbody .missed-col');

            this.render();
        },

        render: function() {
            var missedDays = octapus.getMissing();

            missedDays.forEach(function(day, index) {
                view.$allMissed[index].innerText = day;
            });
        }
    };

    octapus.init();

}());