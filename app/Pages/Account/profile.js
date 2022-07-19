import m from "mithril"
import { handlers, AVATAR_URL } from "@/Utils/index.js"
import { path, prop, without, assoc, propEq } from "ramda"
import { addSuccess } from "@/Components/toast"
import Map from "./map.js"

const state = {
  addresses: [],
  files: [],
  locations: [],
  status: "",
  disableEdit: true,
}

const fetchLocationsTask = (mdl) =>
  mdl.http.back4App
    .getTask(mdl)("classes/Addresses?limit=1000")
    .map(prop("results"))

const toLocationVM = (addressIds) => (locations) =>
  locations.map((location) =>
    assoc("selected", addressIds.includes(location.objectId), location)
  )

const fetchLocations = (mdl) => (state) => {
  const onError = log("error fetching locations")
  const onSuccess = (locations) => {
    state.locations = locations
  }

  fetchLocationsTask(mdl)
    .map(toLocationVM(mdl.data.profile.addressIds))
    .fork(onError, onSuccess)
}

const getImageSrc = (data) =>
  data.avatar && !data.avatar.includes("fake") ? data.avatar : AVATAR_URL

const onError = (x) => {
  log("on error  profile")(x)
}
const onSuccess = (mdl, reload) => {
  addSuccess("Profile updated successfully", 5000)
  reload(mdl)
}

const updateProfileTask = (mdl) => (data) =>
  mdl.http.back4App.putTask(mdl)(
    `Classes/Accounts/${mdl.data.profile.objectId}`
  )(data)

const removeImage = (mdl, data) => {
  data.avatar = null
  updateProfileTask(mdl)(data).fork(log("e"), () =>
    addSuccess("Image deleted", 5000)
  )
}

const updateModelAccount = (mdl, addressIds) => {
  mdl.data.account.addressIds = addressIds
  return mdl
}

const updateProfileMeta =
  (mdl) =>
    ({ name, addressIds, telephone }) =>
      (reload) => {
        return updateProfileTask(mdl)({ name, addressIds, telephone })
          .map((_) => updateModelAccount(mdl, addressIds))
          .fork(onError, (_) => onSuccess(mdl, reload))
      }

const uploadImage = (mdl) => (file) => {
  mdl.http.imgBB
    .postTask(mdl)(file[0])
    .map(path(["data", "thumb", "url"]))
    .map((avatar) => {
      state.avatar = avatar
      return { avatar }
    })
    .chain(updateProfileTask(mdl))
    .map(() => (mdl.data.profile.avatar = state.avatar))
    .fork(onError, () => addSuccess("Image Updated", 5000))
}

const onInput = (profile) =>
  handlers(["oninput"], (e) => {
    if (e.target.type == "checkbox") {
      return (profile[e.target.id] = JSON.parse(e.target.checked))
    }
    if (e.target.id == "file") {
      return (profile[e.target.id] = e.target.files[0])
    } else {
      return (profile[e.target.id] = e.target.value)
    }
  })

const addAddress = (profile, addressId) => profile.addressIds.push(addressId)

const removeAddress = (profile, addressId) => {
  state.locations.find((l) => l.objectId == addressId).selected = false
  profile.addressIds = without([addressId], profile.addressIds)
}

const toggleEditProfile = (mdl, state, reload) => {
  state.disableEdit = !state.disableEdit
  fetchLocations(mdl)(state)
  state.disableEdit && updateProfileMeta(mdl)(mdl.data.profile)(reload)
}

const Profile = ({ attrs: { mdl, reload } }) => {
  state.addresses = mdl.data.addresses
  return {
    view: ({ attrs: { mdl } }) => {
      return m(
        "section.p-y-50",
        m(
          "article.row",
          { ...onInput(mdl.data.profile) },
          m(
            "figure.col",
            m("img.avatar", {
              src: getImageSrc(mdl.data.profile),
            }),
            m(
              "figcaption",
              { style: { width: "180px" } },
              mdl.data.profile.avatar
                ? m(
                  "button.button",
                  {
                    style: {
                      borderColor: "var(--color-error)",
                      color: "var(--color-error)",
                    },
                    onclick: (e) => removeImage(mdl, mdl.data.profile),
                  },
                  "Remove Image"
                )
                : m(
                  "label.button",
                  { label: "profile-pic" },
                  "Add profile picture",
                  m("input", {
                    style: { display: "none" },
                    type: "file",
                    id: "avatar",
                    value: state.files,
                    onchange: (e) => uploadImage(mdl)(e.target.files),
                  })
                )
            )
          ),
          m(
            "section.col",
            state.disableEdit
              ? m(
                "button.button",
                {
                  style: {
                    borderColor: "var(--blue)",
                    color: "var(--blue)",
                  },
                  onclick: (e) => toggleEditProfile(mdl, state),
                },
                "Edit Profile Info"
              )
              : m(
                ".grouped",
                m(
                  "button.button",
                  {
                    style: {
                      borderColor: "var(--red)",
                      color: "var(--red)",
                    },
                    onclick: () => (state.disableEdit = !state.disableEdit),
                  },
                  "Cancel Edit"
                ),
                m(
                  "button.button",
                  {
                    style: {
                      borderColor: "var(--green)",
                      color: "var(--green)",
                    },
                    onclick: (e) => toggleEditProfile(mdl, state, reload),
                  },
                  "Finish Edit and Save"
                )
              ),
            m(
              "form",
              !mdl.data.profile.emailVerified &&
              m("label.warning", "email not verified"),
              m(
                "label",
                "email",
                m("input", {
                  disabled: true,
                  id: "email",
                  value: mdl.data.profile.email,
                })
              ),
              m(
                "label",
                "name",
                m("input", {
                  disabled: state.disableEdit,
                  id: "name",
                  value: mdl.data.profile.name,
                })
              ),
              m(
                "label",
                "telephone",
                m("input", {
                  disabled: state.disableEdit,
                  id: "telephone",
                  value: mdl.data.profile.telephone,
                })
              ),
              m(
                "label.icon",
                "Address",
                state.disableEdit
                  ? mdl.data.addresses.map((address) =>
                    m("input", {
                      disabled: true,
                      id: "address",
                      value: address.property,
                    })
                  )
                  : [
                    m(
                      "label.label",
                      m(
                        "select",
                        {
                          multiple: true,
                          value: mdl.data.profile.addressId,
                        },
                        state.locations.map((location) =>
                          m(
                            "option",
                            {
                              onclick: (e) => {
                                location.selected = true

                                state.addresses = state.addresses
                                  .filter(
                                    (l) => l.objectId == location.objectId
                                  )
                                  .any()
                                  ? state.addresses
                                  : state.addresses.concat([location])

                                addAddress(
                                  mdl.data.profile,
                                  location.objectId
                                )
                              },
                              class: mdl.data.profile.addressIds.includes(
                                location.objectId
                              )
                                ? "option text-primary"
                                : "option",
                              value: location.objectId,
                            },
                            location.property
                          )
                        )
                      )
                    ),
                    m(
                      "ul",
                      state.locations
                        .filter(propEq("selected", true))
                        .map((l) =>
                          m(
                            "li.grouped",
                            m("p", l.property),
                            m(
                              ".text-primary.underline",
                              {
                                onclick: (_) => {
                                  location.selected = false
                                  state.addresses = state.addresses.filter(
                                    (a) => a.objectId != l.objectId
                                  )
                                  removeAddress(mdl.data.profile, l.objectId)
                                },
                              },
                              "remove"
                            )
                          )
                        )
                    ),
                  ]
              )
            )
          )
        ),
        state.addresses.any()
          ? m(
            "section",
            m(
              "h4",
              "If the coordinates of the icon are not on top of your home please contact an administrator at BonhamAcresCivicAssociation at gmail dot com."
            ),
            m(Map, {
              mdl,
              locations: state.addresses,
            })
          )
          : m("p.hero", "Edit your profile to select your address(s)")
      )
    },
  }
}

export default Profile

