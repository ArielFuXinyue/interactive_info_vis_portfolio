// Example 2
registerSketch('sk6', function (p) {
  // data
  let usStatesTerritories;

  // select boxed
  let stateOthersSelect;
  let territoryTypeSelect;

  // current state variables
  let currentStateOtherSelection;
  let currentDataset = [];

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    usStatesTerritories = p.loadTable("data/us_states_territories.csv", "csv", "header")
    console.log("loaded states/territories data:", usStatesTerritories);

    // select box with options to display states, non-states, or both
    stateOthersSelect = p.createSelect();
    stateOthersSelect.position(50, 100);
    stateOthersSelect.option("State");
    stateOthersSelect.option("Non-State");
    stateOthersSelect.option("Both");
    stateOthersSelect.selected("State");

    territoryTypeSelect = p.createSelect();
    territoryTypeSelect.position(50, 150);
    
  };

  p.handleResetVisState = function() {
    // check if there is a change in the first fropdown
    // then update the second dropdown options 
    // select the current data: states, non-states, or both
    const newStateOtherSelection = stateOthersSelect.selected();
    // console.log("state/other selection:", stateOtherSelection);
    if(newStateOtherSelection !== currentStateOtherSelection) {
      console.log("state selection box changed:", newStateOtherSelection);
      currentDataset = usStatesTerritories.getRows();
      if(currentStateOtherSelection == "State") {
        // filter for states
        currentDataset = currentDataset.filter(row => row.Status == "state");
      } else if(currentStateOtherSelection == "Non-State") {
        // filter for non-states
        currentDataset = currentDataset.filter(row => row.Status != "state");
      } // else we want all data, so no filter

      territoryTypeSelect.elt.innerHTML = "";
      // the teritoryTeypeSelect should have all the "Name" values from the currentDataset
      for(const dataRow of currentDataset) {
        territoryTypeSelect.option(dataRow.obj.Name)
      }
    };
  };

  p.draw = function () {
    let hoverDetectElements = [];

    p.background(255);

    // handle dropdown changes and update the second dropdown options accordingly
    p.handleResetVisState();

    // get current selected territory
    const currentTerritorySelected = territoryTypeSelect.selected();

    // draw scatterplot from current data
    const x0 = 200;
    const y0 = p.windowHeight - 100;
    const dotRadius = 5;
    for(const row of currentDataset){
      const xPos = x0 + row.obj["Population (2020)"] / 1000000; 
      const yPos = y0 - row.obj.REpresentatives * 2;
      const representatives = parseInt(row.obj.Representatives.replace(",", ""))
      // if(row.obj.Name == currentTerritorySelected){
      //   p.stroke("red")
      // } else {
      //   p.stroke("black")
      // }
      p.stroke("black");
      p.circle(xPos, yPos, dotRadius);
      hoverDetectElements.unshift({
        type: "circle",
        x: xPos,
        y: yPos,
        r: dotRadius,
        data: row.obj
      })
    }

    const selectedRow = currentDataset.find(row => row.obj.Name === currentTerritorySelected);
    if(selectedRow){
      // find selected row
      // const selected = currentDataset.find(row => row.obj.Name === currentTerritorySelected);
      const selectedPop = parseInt(selectedRow.obj["Population (2020)"].replace(",", ""));
      // Highlight the currently selected territory in the scatterplot
      const selectedXPos = x0 + selectedRow.obj["Population (2020)"] / 1000000; 
      const selectedYPos = y0 - selectedRow.obj.REpresentatives * 2;
      p.stroke("red");
      p.circle(selectedXPos, selectedYPos, dotRadius);
      
      // add text to show info selected
      p.noStroke()
      p.fill(0);
      p.text("Population (2020): " + selectedRow.obj["Population (2020)"], 50, 150);
      p.text("Number of Representatives: " + selectedRow.obj.Representatives, 50, 20);
    }

    // detect hover
    for(const hoverEl of hoverDetectElements){
      // see if mouse is inside any of the elements
      // assume all circles for now
      // see is distance to center of hover element is less than radius
      const dist = Math.sqrt(
        Math.pow(p.mouseX - hoverEl.x, 2) + 
        Math.pow(p.mouseY - hoverEl.y, 2)
      );
      if (dist < hoverEl.r){
        // console.log("hovering over:", hoverEl.row.obj.Name);
        territoryTypeSelect.selected(hoverEl.row.obj.Name);
        break; // only allow one thing to be hovered over
      }
    }
  };
  
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
