var config = {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    fill: false,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: [5, 12, 31, 45, 30, 22, 10],
                },

                {
                    label: 'My Second dataset',
                    fill: false,
                    backgroundColor: 'rgb(54, 162, 235)',
                    borderColor: 'rgb(54, 162, 235)',
                    data: [17, 15, 50, 22, 31, 44, 19],
                }
            ]
        },

        options: {
            responsive: true,
            scales: {
                xAxes: [{display: true}],
                yAxes: [{display: true}]
            }
        }

    };


window.onload = function () {
        var ctx = document.getElementById('mychart').getContext('2d');
        window.myChart = new Chart(ctx, config);
    };
