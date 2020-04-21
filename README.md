# Musical Quest
[Musical Quest](https://asunamasuda.github.io/Milestoneproject_2/) is a lyrics and youtube video search where you can explore the world's largest catalog of song lyrics and related artist information powered by Musixmatch API, LastFM API and Youtube API. 

[Live demo](https://asunamasuda.github.io/Milestoneproject_2/) is available here.

<p align="center"><img src = "https://github.com/AsunaMasuda/Milestoneproject_2/blob/master/assets/images/README/Webpage-screenshot.png?raw=true" width=700></p>

## Table of Contents

1. [UX](#ux)
    - [Goals](#goals)
        - [Visiter's Goals](#visiter's-goals)
        - [Developer's Goals](#developer's-goals)
    - [User Stories](#user-stories)
    - [Design Choices](#design-choices)
    - [Wireframes](#wireframes)

2. [Features](#features)
    - [Existing Features](#existing-features)
        - [Song Search & Result](#song-search-&-result)
        - [Lyrics](#lyrics)
        - [Artist Information](#artist-information)
    - [Features Left to Implement](#features-left-to-implement)

4. [Technologies Used](#technologies-used)

5. [Testing](#testing)
    - [Manual Testing](#manual-testing)
    - [How User Stories Needs Were Met](#how-user-stories-needs-were-met)
    - [Bugs](#bugs)

6. [Deployment](#deployment)
    - [Local Deployment](#local-deployment)

7. [Credits](#credits)

# UX
## Goals
The goal of this website is to let visiters to enjoy exploring their favorite song's lyrics, with listening to the song. 

### Visiter's Goals
This website is created for people who like to learn lyrics while listening to the music.

Visiter's goals are:
- Explore various songs and their lyrics
- Listen and watch the video of the song they chose for lyrics
- Gain interesting facts related to the artist they searched

[Musical Quest](https://asunamasuda.github.io/Milestoneproject_2/) met this goal by:
- Intuitive and inductive search function 
- Automatically display the lyrics and the video after the visiter clicked the song name
- Provide Recommended Artists powered by musixmatch and Numbers of listeners and playcounts provided by Last.FM. 

### Developer's Goals
The deveoper's Goals were:
- Get better understanding of JavaScript and JQuery
- Gain the practical skills of how to handle RESTful API and its related JavaScript technologies (Asynchronous Operations)

## User Stories
As a visiter to [Musical Quest](https://asunamasuda.github.io/Milestoneproject_2/) I'd want to:
- Search and select a song within the site without any stress and hassle
- Have a nice and experience in user interface, such as beautiful graphics, consistent designs, responsive layouts and suited fonts

## Design Choices
Music Quest was designed with hassle-free and intuitive use in mind:
- It utilises a background picture of a music concert and the font colors were chosen to match the color in the picture
- Visiters who use a desktop PC or a laptop don't need any scrolling to see all the content 

## Wireframes
Wireframes were created with [balsamiq](https://balsamiq.com/).
- [Original Project Mockup](https://github.com/AsunaMasuda/Milestoneproject_2/blob/master/images/README/Mockup.png)

# Features

## Existing Features
### Song Search & Result
- The search features an autocomplete for the artist name pulled from musixmatch API.
- The result section returns the first 15 songs ordered by the populality.
- "Load More" feature feeds the next 15 results.
- It automatically refreshes search results if visiters press the search button with a different artist name. 

### Lyrics
- It desplays the selected song title and its lyrics.
- The lyrics are formatted to make it easy to read.

### Artist Information
- At the top, It returns three recommended artists that visiters might like which are chosen by searched artist. This feature is powered by musixmatch.
- At the middle, It provides the number of listeners and playcounts by the searched artist in Last.FM. 
- At the bottom, It displays a Youtube Video relating the song selected. This feature is powered by Youtube API. 

## Features Left to Implement
- Split the current JavaScript codes to front-end and back-end features accordingly
- Hide API keys using Node.js and environmental variables

# Technologies Used
1. HTML
2. CSS
3. Bootstrap (v4.4.1)
4. JavaScript (JQuery, JQuery-UI)
5. Git/GitHub
6. Gitpod

# Testing
### Validation Tools
- [FREEFORMATTER.COM](https://www.freeformatter.com/) for validating HTML/CSS/JaveScript code. 

### Manual Testing
4) Manually go though every part of your site and write out how you confirmed that each link, hover effect and other interactive parts of the site work as you expect.

### Bugs
List any bugs you came across while creating the site and while testing it. Include the fixes you came up with. (I have two sections here, one for fixed bugs and one for bugs I have not found a solution for yet.)

### How User Stories Needs Were Met
- This webpage supports autocomplete when visiters type artist name and also provide seamless experiences by dynamic and interactive interfaces by JQuery. With these usability, visitera can explore this site without hassle. 

# Deployment
To deploy this page to GitHub Pages from my [GitHub repository](https://github.com/AsunaMasuda/Milestoneproject_2), the following steps were taken: 
1. Log into GitHub. 
2. From the list of repositories on the screen, select **AsunaMasuda/Milestoneproject_2**.
3. From the menu items near the top of the page, select **Settings**.
4. Scroll down to the **GitHub Pages** section.
5. Under **Source**, click the drop-down menu labelled **None** and select **Master Branch**.
6. On selecting Master Branch, the page is automatically refreshed, the website is now deployed. 
7. Scroll back down to the **GitHub Pages** section to retrieve the link to the deployed website.

## Local Deployment
To clone this project from GitHub:
1. At the top of this repository, click the green button **Clone or download**.
2. In the Clone with HTTPs section, copy the clone URL for the repository. 
3. Open your favourite terminal (cmd, powershell, bash, git bash, etc.)
4. Change the current working directory to the location where you want the cloned directory to be made.
5. Type `git clone`, and then paste the URL you copied in Step 2.
6. Press Enter. Your local clone will be created.

# Credits

## Content
- All text within this project was written by the developer.

## Media
### Icons
- The icons were provided by [Font Awesoms](https://fontawesome.com/)

### Background Photos
- Background image Photo by Nainoa Shizuru on Unsplash

### API
- [Musixmatch](https://www.musixmatch.com/) for lyrics
- [Last.FM](https://www.last.fm/home) for listners, playcounts and a link to the artist page
- [Youtube API](https://developers.google.com/youtube/v3) for music video

## Acknowledgements
I gained a deeper understanding about REST APIs from this article: [Understanding And Using REST APIs](https://www.smashingmagazine.com/2018/01/understanding-using-rest-api/).

I also gained a better understanding of Ajax, Async, Callback  and Promises in JavaScript from this article: [Ajax — Async, Callback & Promise](https://medium.com/front-end-weekly/ajax-async-callback-promise-e98f8074ebd7).

Thanks to:
My Code Institute Mentor Guido Cecilio Garcia Bernal for his advise throughout the development process.
