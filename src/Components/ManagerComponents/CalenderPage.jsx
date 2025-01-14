/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Paper from "@mui/material/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  Appointments,
  AppointmentTooltip,
  DateNavigator,
  Toolbar,
} from "@devexpress/dx-react-scheduler-material-ui";
import { useEffect, useState } from "react";
import "./CalenderPage.css";
import axios from "axios";
import { appointments } from "./appointments";

function getCurrentFormattedDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");

  const formattedDate = year + "-" + month + "-" + day;
  return formattedDate;
}
const currentDate = getCurrentFormattedDate();
const mycolor = "#e0c802";

const Appointment = ({ children, style, ...restProps }) => (
  <Appointments.Appointment
    {...restProps}
    style={{
      ...style,
      backgroundColor: mycolor,
      borderRadius: "10px",
    }}
  >
    {children}
  </Appointments.Appointment>
);

const CalenderPage = () => {
  const [allshifts, setAllSHifts] = useState([]);
  const [morningcheck, setMorningcheck] = useState(true);
  const [lunchcheck, setLunchcheck] = useState(true);
  const [eveningcheck, setEveningcheck] = useState(true);
  const [arrayofshiftsformanager, setArrayofshiftsformanager] =
    useState(allshifts);
  const [savearrayofshiftsformanager, setsaveArrayofshiftsformanager] =
    useState(allshifts);
  const [searchworkerincalander, setSerachworkerincalander] = useState();

  useEffect(() => {
    axios
      .get("http://localhost:5000/shifts/fetchAllShifts")
      .then(({ data }) => setAllSHifts(data))
      .catch((err) => {
        console.log(err.response?.data);
        alert(err.response?.data);
      });
  }, []);

  const [data, setData] = useState([]);

  useEffect(() => {
    const acceptedshift = allshifts.filter((obj) => obj.status == "accept");
    setData(acceptedshift);
    console.log(acceptedshift, "This is the accepted shift");
  }, [appointments]);

  useEffect(() => {
    let arraybycheckbox = allshifts;
    let updateforarrayofcheckbox = arraybycheckbox.filter(
      (obj) => obj.status === "accept"
    );

    if (morningcheck != true) {
      updateforarrayofcheckbox = updateforarrayofcheckbox.filter(
        (element) => element.hour !== "morning"
      );
    }
    if (lunchcheck != true) {
      updateforarrayofcheckbox = updateforarrayofcheckbox.filter(
        (element) => element.hour !== "lunch"
      );
    }
    if (eveningcheck != true) {
      updateforarrayofcheckbox = updateforarrayofcheckbox.filter(
        (element) => element.hour !== "evening"
      );
    }

    if (searchworkerincalander == null || searchworkerincalander == undefined) {
      setData(updateforarrayofcheckbox);
    } else {
      let savename = searchworkerincalander.toLowerCase();
      setData(
        updateforarrayofcheckbox.filter((element) =>
          element.title.toLowerCase().includes(savename)
        )
      );
    }
  }, [morningcheck, lunchcheck, eveningcheck, searchworkerincalander]);

  function searchWorkerFunction(workername) {
    workername = workername.toLowerCase();
    setArrayofshiftsformanager(
      savearrayofshiftsformanager.filter((element) =>
        element.title.toLowerCase().includes(workername)
      )
    );
  }

  function sortfunctionofshowingshifts(value1) {
    if (value1 == "0") {
      setArrayofshiftsformanager(savearrayofshiftsformanager);
    }
    if (value1 == "1") {
      const update1 = arrayofshiftsformanager.slice().reverse();
      setArrayofshiftsformanager(update1);
    }
    if (value1 == "2") {
      const update2 = arrayofshiftsformanager.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      setArrayofshiftsformanager(update2);
    }
    if (value1 == "3") {
      const update3 = arrayofshiftsformanager.sort(
        (a, b) => new Date(a.startDate) - new Date(b.startDate)
      );
      setArrayofshiftsformanager(update3);
    }
    if (value1 == "4") {
      const update4 = arrayofshiftsformanager.sort(
        (a, b) => new Date(b.startDate) - new Date(a.startDate)
      );
      setArrayofshiftsformanager(update4);
    }
  }

  return (
    <div>
      <div id="calender-page-div">
        <div id="filternavbar-calander">
          <div id="div-checkboxes">
            <div className="divcheckbox">
              <label className="container">
                <input
                  type="checkbox"
                  defaultChecked={true}
                  onClick={() => setMorningcheck(!morningcheck)}
                ></input>
                <div class="checkmark"></div>
              </label>
              <span>morning</span>
            </div>
            <div className="divcheckbox">
              <label className="container">
                <input
                  type="checkbox"
                  defaultChecked={true}
                  onClick={() => setLunchcheck(!lunchcheck)}
                ></input>
                <div class="checkmark"></div>
              </label>
              <span>lunch</span>
            </div>
            <div className="divcheckbox">
              <label className="container">
                <input
                  type="checkbox"
                  defaultChecked={true}
                  onClick={() => setEveningcheck(!eveningcheck)}
                ></input>
                <div class="checkmark"></div>
              </label>
              <span>evening</span>
            </div>
          </div>
          <input
            type="text"
            id="searchworker1"
            placeholder="search for worker..."
            onChange={(e) => setSerachworkerincalander(e.target.value)}
          ></input>
        </div>
        <Paper>
          <Scheduler data={data}>
            <ViewState defaultCurrentDate={currentDate} />
            <WeekView startDayHour={9} endDayHour={22} />
            <h1 id="worker-shift-calender-header">Worker Shift Calender</h1>
            <Toolbar />
            <DateNavigator />
            <Appointments appointmentComponent={Appointment} />
            <AppointmentTooltip />
          </Scheduler>
        </Paper>
      </div>
      <div id="container-all-ater-calender">
        <div id="calender-worker-filter-div">
          <h3 id="sort-calender-by-header">Sort By:</h3>
          <select
            defaultValue={"0"}
            id="sort-select"
            onChange={(e) => sortfunctionofshowingshifts(e.target.value)}
          >
            <option className={"option-of-sort"} value="0">
              First Sended
            </option>
            <option className={"option-of-sort"} value="1">
              Last Sended
            </option>
            <option className={"option-of-sort"} value="2">
              Worker Name
            </option>
            <option className={"option-of-sort"} value="3">
              Dates: Earliest
            </option>
            <option className={"option-of-sort"} value="4">
              Dates: Latest
            </option>
          </select>
          <input
            type="text"
            id="searchworker2"
            placeholder="Search By Worker Name"
            onChange={(e) => searchWorkerFunction(e.target.value)}
          ></input>
        </div>
        <div id="display-shifts-container">
          {arrayofshiftsformanager.map((element, index) => (
            <Divcardofshift
              element={element}
              key={index}
              shiftsincalander={data}
              setshiftsincalander={setData}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default CalenderPage;
