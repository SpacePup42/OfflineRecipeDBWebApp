/**
 * Sorts a HTML table.
 * 
 * @param {HTMLTableElement} table The table to sort
 * @param {number} column The index of the column to sort
 * @param {boolean} asc Determines if the sorting will be in ascending
 */
function sortTableByColumn(table, column, asc = true) {
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll("tr"));

    // Sort each row
    const sortedRows = rows.sort((a, b) => {
        const aColText = a.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim();
        const bColText = b.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim();

        return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
    });

    // Remove all existing TRs from the table
    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }

    // Re-add the newly sorted rows
    tBody.append(...sortedRows);

    // Remember how the column is currently sorted
    table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
    table.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th-sort-asc", asc);
    table.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th-sort-desc", !asc);
}

document.querySelectorAll(".fullMenuTable th").forEach(headerCell => {
    headerCell.addEventListener("click", () => {
        const tableElement = headerCell.parentElement.parentElement.parentElement;
        const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
        const currentIsAscending = headerCell.classList.contains("th-sort-asc");

        sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
    });
});

function tableSearch() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  var NumHits = 0;
  var Output  = document.getElementById('output')

  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  console.log(filter);
  table = document.getElementById("fullMenuTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    tdID = tr[i].getElementsByTagName("td")[0];
    tdName = tr[i].getElementsByTagName("td")[1];
    tdCuisine = tr[i].getElementsByTagName("td")[2];
    tdEffort = tr[i].getElementsByTagName("td")[3];
    tdMethod = tr[i].getElementsByTagName("td")[4];
    tdCourse = tr[i].getElementsByTagName("td")[5];
    tdDiet = tr[i].getElementsByTagName("td")[6];
    tdIngredients = tr[i].getElementsByTagName("td")[7];

    if (tdID && tdName && tdCuisine && tdEffort && tdMethod && tdCourse && tdDiet && tdIngredients) {
      IDValue = tdID.textContent || tdID.innerText;
      NameValue = tdName.textContent || tdName.innerText;
      CuisineValue = tdCuisine.textContent || tdCuisine.innerText;
      EffortValue = tdEffort.textContent || tdEffort.innerText;
      MethodValue = tdMethod.textContent || tdMethod.innerText;
      CourseValue = tdCourse.textContent || tdCourse.innerText;
      DietValue = tdDiet.textContent || tdDiet.innerText;
      IngredientsValue = tdIngredients.textContent || tdIngredients.innerText;

if (IDValue.toUpperCase().indexOf(filter) > -1 || NameValue.toUpperCase().indexOf(filter) > -1 || CuisineValue.toUpperCase().indexOf(filter) > -1 || EffortValue.toUpperCase().indexOf(filter) > -1 || MethodValue.toUpperCase().indexOf(filter) > -1 || CourseValue.toUpperCase().indexOf(filter) > -1 ||DietValue.toUpperCase().indexOf(filter) > -1 || IngredientsValue.toUpperCase().indexOf(filter) > -1) {

        tr[i].style.display = "";
        var NumHits = NumHits+1;
} else {

        tr[i].style.display = "none";

      }
	Output.innerHTML = "<h1>Displayed (" +NumHits+ ")</h1>";
	Output.style.float="left";
	Output.style.paddingTop="11px";

    }
  }
}
