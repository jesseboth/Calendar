window.onload = run
function run() {
    document.getElementById("calendar").addEventListener("click", toggleCal);
    document.getElementById("all_day").addEventListener("click", rotate_click);
    document.querySelector('#description_container').addEventListener('click', description_clicked_on);

    document.getElementById("red_dot").addEventListener("click", hide_description);
    document.querySelector('.searchTerm').addEventListener('click', clickyClick);
    document.querySelector('.searchButton').addEventListener('click', search);
    document.getElementById("pic").addEventListener("click", userToggle);
    document.getElementById("img_user1").addEventListener("click", first_tab);
    document.getElementById("img_user2").addEventListener("click", second_tab);

    document.getElementById("apps").addEventListener("click", appToggle);
    document.querySelectorAll('.app').forEach(item => {
        item.addEventListener('click', event => {
          app_clicked_on()
        })
      })
    document.querySelector('.searchTerm').addEventListener('keypress', clickyClick)

    get_user()
    updateTime();
    set_all_day();
    wind()
    cal_icon()
    start_color()
    listeners()
    setInterval(updateTime, 100);
}