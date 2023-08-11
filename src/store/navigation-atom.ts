import { atom } from "jotai";

type DisplayMainNavNameType = "質問" | "設定"

export const displayMainNavNameAtom = atom<DisplayMainNavNameType>("質問")
