

const form = document.getElementById("bookingForm");
const dateInput = document.getElementById("appointmentDate");
const appointmentsList = document.getElementById("appointmentsList");
const submitButton = form.querySelector('button[type="submit"]');

let editingIndex = null;

// منع اختيار تاريخ قديم
const today = new Date();

const todayString =
  today.getFullYear() + "-" +
  String(today.getMonth() + 1).padStart(2, "0") + "-" +
  String(today.getDate()).padStart(2, "0");

dateInput.min = todayString;

// عرض المواعيد
function showAppointments() {
  const appointments = JSON.parse(
    localStorage.getItem("appointments") || "[]"
  );

  appointmentsList.innerHTML = "";

  appointments.forEach(function(appointment, index) {
    const item = document.createElement("li");

    const details = document.createElement("span");
    details.textContent =
      appointment.name + " - " +
      appointment.date + " - " +
      appointment.doctor;

    // زر التعديل
    const editButton = document.createElement("button");
    editButton.textContent = "تعديل";
    editButton.className = "edit-btn";
    editButton.type = "button";

    editButton.addEventListener("click", function() {
      document.getElementById("patientName").value =
        appointment.name;

      dateInput.value = appointment.date;

      document.getElementById("doctor").value =
        appointment.doctor;

      editingIndex = index;
      submitButton.textContent = "حفظ التعديل";

      form.scrollIntoView({ behavior: "smooth" });
    });

    // زر الحذف
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "حذف";
    deleteButton.className = "delete-btn";
    deleteButton.type = "button";

    deleteButton.addEventListener("click", function() {
      appointments.splice(index, 1);

      localStorage.setItem(
        "appointments",
        JSON.stringify(appointments)
      );

      editingIndex = null;
      form.reset();
      submitButton.textContent = "احجز الآن";

      showAppointments();
    });

    const actions = document.createElement("div");
    actions.className = "appointment-actions";

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    item.appendChild(details);
    item.appendChild(actions);
    appointmentsList.appendChild(item);
  });
}

// إضافة موعد أو تعديل موعد موجود
form.addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.getElementById("patientName").value.trim();
  const date = dateInput.value;
  const doctor = document.getElementById("doctor").value;

  if (date < todayString) {
    alert("لا يمكن حجز موعد بتاريخ قديم ❌");
    return;
  }

  const appointments = JSON.parse(
    localStorage.getItem("appointments") || "[]"
  );

  const appointment = { name, date, doctor };

  if (editingIndex === null) {
    appointments.push(appointment);
    alert("تم حفظ الموعد بنجاح! ✅");
  } else {
    appointments[editingIndex] = appointment;
    alert("تم تعديل الموعد بنجاح! ✅");
  }

  localStorage.setItem(
    "appointments",
    JSON.stringify(appointments)
  );

  editingIndex = null;
  form.reset();
  submitButton.textContent = "احجز الآن";

  showAppointments();
});

showAppointments();
