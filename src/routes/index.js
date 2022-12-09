import { Router } from "express";

import {
  renderAboutPage,
  renderIndexPage,
  renderNewEntryPage,
  createNewEntry,
  deleteEntry,
  renderUpdatePage,
  updateEntry,
  toUseEntry
} from "../controllers/index.controller";

const router = Router();

router.get("/", renderIndexPage);

router.get("/about", renderAboutPage);

router.get("/new-entry", renderNewEntryPage);

router.post("/new-entry", createNewEntry);

router.get("/delete/:id", deleteEntry);

router.get("/update", renderUpdatePage);

router.post("/", updateEntry);

router.get("/touse/:id", toUseEntry);

export default router;
