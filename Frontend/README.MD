# BONJOUR

This is a tiny readme I will finish later

# Page structure
For now each page uses 2 main components : 
-MainContainer is full width full height and manages the header
-PageContainer is 2/3 width and flex col, handles page content

Should look like this :
<> <- react fragment (optionnal)
    <MainContainer>
        <PageContainer>
            My content !
        </PageContainer>
    </MainContainer>
</>

# Containers
Components/containers.jsx has multiple containers to keep visual consistency

# Interactibles
Interactibles are components as well :
-Avatar handles avatar display + fallback to first letter of displayname
-Avatar Upload handles file upload to avatar route
-Editable field is an input with a edit mode that has a validate/cancel button form and returns value when confirmed
-Button includes multiple buttons that act like a regular button but have styles stored in the variant parameter
-UserSearch does a search in the users route on each change of its content, then display them in a list under itself

# Todo
-Migrate everything to tailwindCSS
-help