# LAYOUT

`components/common/` contains components used by multiple filing types
`components/Dissolution/` contains components used only by dissolution filings
`components/Incorporation/` contains components used only by incorporation filings
`components/Registration/` contains components used only by registration filings

# WARNING

To prevent circular dependencies, do not create or use `index.ts` files for components
in this folder or sub-folders, EXCEPT FOR `@/components/index.ts`, which is used
exclusively by external components.
