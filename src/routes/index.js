import { Router } from "express";

import {
  renderAboutPage,
  renderIndexPage,
  renderNewEntryPage,
  createNewEntry,
  deleteEntry,
  updateEntry,
  toUseEntry,
  updateAux,
} from "../controllers/index.controller";

const router = Router();

router.get("/", renderIndexPage);

router.get("/about", renderAboutPage);

router.get("/new-entry", renderNewEntryPage);

router.post("/new-entry", createNewEntry);

router.get("/delete/:id", deleteEntry);

router.post("/update", updateEntry);

router.post("/updateaux", updateAux);

router.get("/touse/:id", toUseEntry);

export default router;
