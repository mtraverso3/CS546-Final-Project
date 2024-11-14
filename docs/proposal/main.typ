#import "template.typ": *


#show: project.with(
  title: "Home Media Storage and Sharing Platform",
)


= Group Members
- Keona Hicks
- Megan Presbitero
- Marcos Traverso
- Alice Zaytseva


= Introduction
Our application's goal is to allow users to store and share home video/media.
This would provide friends and families with a centralized platform to store and manage their media collections.

- Who is your target user/demographic?
  - Friends and Family looking to share personal media files in a more private space
- What value does your application bring the user?
  - Having a more private and simple way to store and share your media in one place

== Motivation
In a world that is increasingly more online the average user is forced to use more and more different applications, creating inconvenience and annoyance in what should instead be an easy and efficient service. 
With our product we will bridge this gap, building a platform where the user will be able to consolidate all their media in a secure, personalized, and streamlined way.

While our competitors may include YouTube, Google Drive, Plex, and other media sharing platforms, our application seeks to overcome the "commercial" downsides of these other platforms. 
On other available services the user is greatly limited the user's control over the media they are able to upload and store, but with our product the user will be able to keep all their media in one secure home location. 
Unlike our competitors we will put the user first, creating a free, open-source, and less commercialized alternative to other media storage applications.

= Core Features
+ Media Uploading
  + Users can upload various types of media, such as home videos, movies, and TV shows directly to the platform.
+ Movie/TV Show Tagging
  + Movies and TV shows can be tagged with their respective TMDB information, providing information such as director, cast, year of release, etc.
  + The goal here is to use the TMDB API #footnote[https://developer.themoviedb.org/reference/intro/getting-started/] to fetch metadata for media.
+ Creating collection of media
  + Users can group media into personalized collections or folders. These could be based on themes or whatever the user decides to use.
  + Collections make it easier for users to keep their media organized and accessible.
+ Sub-accounts
  + A primary account holder can create multiple sub-accounts under one platform account. This behavior would be the same as a streaming service's user profiles under a main account.
+ Video player
  + The platform will feature a video player that supports high-quality playback and streaming directly from the application.

= Extra Features
+ Uploading other forms of Media
  + Users would also be able to upload photos and documents in addition to videos.
+ Tagging
  + Users can add custom tags to any media files or collections, allowing for more flexible categorization and quicker search results.
  + This feature helps users sort and locate content intuitively without relying solely on file names or collection folders.
+ Downloading media
  + Downloading media is streamlined, allowing users to access their content when needed. 
+ Sharing collections of media
  + Users can share specific collections with other registered users on the platform. This allows easy collaboration between friends and family.
  + External sharing options may be added later, such as sharing temporary links for guest access without requiring a full account.
+ Age-restricted media management
  + Media can be tagged with content ratings, allowing the platform to filter or block access based on the user’s age or role. 
  + This promotes a safer environment for families by enforcing content restrictions where necessary.

= GitHub Project Link
You may find the project on GitHub at the following link: \
#text(rgb("#1155cc"))[#link("https://github.com/mtraverso3/CS546-Final-Project")]


// #bibliography("works.yml", style: "ieee", title: "References")