import { handlers, exists, confirmTask } from "@/Utils"
import Task from "data.task"

export const resetModalState = (state) => {
  state.images = []
  state.modalState("upload")
}
export const resetEditorState = (state) => {
  state.title = ""
  state.author = ""
  state.text = ""
  state.img = ""
  state.thumb = ""
  state.file = null
  state.showPreview(false)
  state.isEditing(false)
  state.showModal(false)
  state.showHelp(false)
  state.objectId = null
}

export const isInvalid = (s) => !exists(s.title) || !exists(s.text)

export const saveImgToGalleryTask =
  (mdl) =>
    ({ data: { image, thumb } }) =>
      mdl.http.back4App
        .postTask(mdl)("Classes/Gallery")({
          album: "blog",
          image: image.url,
          thumb: thumb.url,
        })
        .chain(({ objectId }) =>
          Task.of({
            image: image.url,
            thumb: thumb.url,
            objectId,
          })
        )

export const toBlogs = () => m.route.set("/social/blog")

export const deleteBlog =
  (mdl) =>
    ({ title, objectId, imageId }) =>
      confirmTask(`Are you sure you want to delete the blog ${title}?`)
        .chain((_) =>
          imageId
            ? mdl.http.back4App.deleteTask(mdl)(`Classes/Gallery/${imageId}`)
            : Task.of()
        )
        .chain((_) =>
          mdl.http.back4App.deleteTask(mdl)(`Classes/Blogs/${objectId}`)
        )
        .fork((e) => {
          console.log(e)
        }, toBlogs)

export const onInput = (state) =>
  handlers(["oninput"], (e) => {
    if (e.target.id == "file") {
      state[e.target.id] = e.target.files[0]
    } else {
      state[e.target.id] = e.target.value
    }
  })

