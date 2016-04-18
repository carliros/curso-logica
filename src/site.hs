--------------------------------------------------------------------------------
{-# LANGUAGE OverloadedStrings #-}
import           Data.Monoid (mappend)
import           Hakyll

--------------------------------------------------------------------------------
main :: IO ()
main = hakyll $ do
    match "resources/**" $ do
        route   idRoute
        compile copyFileCompiler

    match "exercises/**" $ do
            route   idRoute
            compile copyFileCompiler

    match "pages/*" $ do
        route   $ gsubRoute "pages/" (const "") `composeRoutes` setExtension "html"
        compile $ pandocCompiler
            >>= loadAndApplyTemplate "templates/default.html" pageCtx
            >>= relativizeUrls

    match "templates/*" $ compile templateCompiler


--------------------------------------------------------------------------------
pageCtx :: Context String
pageCtx =
    dateField "date" "%B %e, %Y" `mappend`
    constField "mainTitle" "Curso de Lógica" `mappend`
    defaultContext
