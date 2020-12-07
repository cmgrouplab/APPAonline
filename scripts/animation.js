//This is for gernerating animation of partilce plots.

function plotGraphs(particles) {
    var traces = [];
    var particleLabel = [];

    function getData(step, particleLabel) { //Get positions of each particle in a step
        var trace;
        trace = {
            name: particleLabel,
            x: [particles[step][particleLabel].position[0]],
            y: [particles[step][particleLabel].position[1]],
            id: particleLabel,
            marker: { size: (RADIUS / 0.2) * 183 }
        };
        return trace;
    }

    for (i = 0; i < NUMBER; i++) { //Get initial positions
        var data = {
            name: i,
            x: [particles[0][i].position[0]],
            y: [particles[0][i].position[1]],
            // x: [0.4],
            // y: [0.6],
            id: i,
            mode: 'markers',
            type: 'scatter',
            marker: {
                color: 'rgb(0, 153, 255)',
                size: (RADIUS / 0.2) * 183,
                line: {
                    color: 'rgb(0, 0, 153)',
                    width: 0.5
                }
            }
        };
        traces.push(data);
        particleLabel.push(i);
    }


    var frames = []; // A frame is a plot for one step
    for (step = 0; step < STEP + 1; step += 10) {
        frames.push({
            name: step,
            data: particleLabel.map(function (particleLabel) {
                return getData(step, particleLabel);
            })
        })
    }

    var sliderSteps = [];
    for (step = 0; step < STEP + 1; step += 10) {
        sliderSteps.push({
            method: 'animate',
            label: step,
            args: [[step], {
                mode: 'immediate',
                transition: { duration: 1 },
                frame: { duration: 1, redraw: false },
            }]
        });
    }

    var layout = {
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)",
        width: 500,
        height: 550,
        margin: {
            l: 18,
            r: 18,
            b: 10,
            t: 5,
            // pad: 4
        },
        showlegend: false,
        xaxis: {
            range: [0, 1],
            showgrid: false,
            mirror: 'ticks',
            zerolinecolor: '#000000',
            zerolinewidth: 6,
            linecolor: '#000000',
            linewidth: 2,
            showticklabels: false
        },
        yaxis: {
            range: [0, 1],
            showgrid: false,
            mirror: 'ticks',
            zerolinecolor: '#000000',
            zerolinewidth: 6,
            linecolor: '#000000',
            linewidth: 2,
            showticklabels: false

        },

        //hovermode: 'closest',

        updatemenus: [{
            x: 0,
            y: 0,
            yanchor: 'top',
            xanchor: 'left',
            showactive: false,
            direction: 'left',
            type: 'buttons',
            pad: { t: 30, r: 10 },
            buttons: [{
                method: 'animate',
                args: [null, {
                    mode: 'immediate',
                    fromcurrent: true,
                    transition: { duration: 1 },
                    frame: { duration: 1, redraw: false }
                }],
                label: 'Play'
            }, {
                method: 'animate',
                args: [[null], {
                    mode: 'immediate',
                    transition: { duration: 0 },
                    frame: { duration: 0, redraw: false }
                }],
                label: 'Pause'
            }]
        }],
        // Finally, add the slider and use `pad` to position it
        // nicely next to the buttons.
        sliders: [{
            pad: { l: 130, t: 0 },
            currentvalue: {
                visible: true,
                prefix: 'Step:',
                xanchor: 'right',
                font: { size: 20, color: '#666' }
            },
            steps: sliderSteps
        }]
    };

    Plotly.newPlot('outputText',
        {
            data: traces,
            layout: layout,
            frames: frames,
            config: { staticPlot: true }
        },
    )
}