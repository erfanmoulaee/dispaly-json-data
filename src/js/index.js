const detailsTransAction = document.querySelector(".details-transActions");
const transActiosTable = document.querySelector(".transActiosTable");
const showDetailsTransActios = document.querySelector(".btn");
const searchInput = document.querySelector("#search");
const chevrons = document.querySelectorAll(".fa-chevron-down");
showDetailsTransActios.addEventListener("click", getTransActions);

let allTransActionsData = [];

//* custom instanse default
const api = axios.create({
  baseURL: "http://localhost:3000",
});

//! search in api
let searchItem = "";
searchInput.addEventListener("input", (e) => {
  searchItem = e.target.value.trim().toLowerCase();
  queryData({ search: searchItem });
});

//! fetch api
function getTransActions() {
  showTransAction();
  api
    .get("/transactions")
    .then((res) => {
      allTransActionsData = res.data;
      console.log(allTransActionsData);
      renderTransActions(res.data);
    })
    .catch((err) => console.log(err));
}

function renderTransActions(_transActions) {
  let result = "";
  _transActions.forEach((item) => {
    result += `
             <tr>
                <td>${item.id} </td>
                <td class=${
                  item.type === "افزایش اعتبار" ? "increase" : "decrease"
                }>${item.type}</td>
                <td>${item.price}</td>
                <td>${item.refId}</td>
                <td>${new Date(item.date).toLocaleString("fa")}</td>
             </tr>
            `;
  });
  detailsTransAction.innerHTML = result;
}

chevrons.forEach((chevron) => {
  chevron.addEventListener("click", (e) => {
    e.target.classList.toggle("asc");
    if (e.target.classList.value.includes("asc")) {
      queryData({
        search: searchInput.value,
        sort: { orderBy: e.target.dataset.orderby, sortType: "asc" },
      });
    } else {
      queryData({
        search: searchInput.value,
        sort: { orderBy: e.target.dataset.orderby, sortType: "desc" },
      });
    }
  });
});

async function queryData({
  search = "",
  sort = { orderBy: "", sortType: "" },
}) {
  let result = "";

  await api.get(`transactions?refId_like=${search}`).then((res) => {
    const sortedData = res.data.sort((a, b) => {
      switch (sort.orderBy) {
        case "price": {
          if (sort.sortType === "asc") {
            return a.price - b.price;
          }
          if (sort.sortType === "desc") {
            return b.price - a.price;
          }
          break;
        }
        case "date": {
          if (sort.sortType === "asc") {
            return a.date - b.date;
          }
          if (sort.sortType === "desc") {
            return b.date - a.date;
          }
          break;
        }
        default: {
          return a.date - b.date;
        }
      }
    });

    result = sortedData;
    renderTransActions(result);
  });
}

//! toggle details transAction
function showTransAction() {
  searchInput.classList.add("hidden");
  searchInput.classList.remove("hidden");
  showDetailsTransActios.classList.add("hidden");
  transActiosTable.classList.remove("hidden");
}
