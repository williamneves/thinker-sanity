import { atom } from "recoil";

const sideMenu = atom({
  key: "sideMenu",
  default: {
    menu: [
      {
        icon: "Home",
        pathname: "/",
        title: "Page 1",
      },
      {
        icon: "Home",
        pathname: "/page-2",
        title: "Page 2",
      },
      {
        icon: "User",
        pathname: "/update-profile",
        title: "Update Profile",
      },
    ],
  },
});

export { sideMenu };
