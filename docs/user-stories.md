**Reddit Clone – User Stories**

1: Account Creation and Login

**As a** visitor,  
**I want to** create an account and log in,  
**So that** I can access the platform and use its features.

**Acceptance Criteria:**

- A visitor can register using the required account information.
- The system validates the registration information.
- A registered user can log in using their credentials.
- The system displays an appropriate error message for invalid credentials.
- Only authenticated users can access protected features.

2: View and Edit User Profile

**As a** registered user,  
**I want to** view and edit my profile,  
**So that** I can manage my personal information.

**Acceptance Criteria:**

- A user can view their profile information.
- A user can edit their profile information.
- The system saves the updated information.
- A user can view their own posts and other relevant profile activity.

3: Create a Community

**As a** registered user,  
**I want to** create a community,  
**So that** I can build a space for people who share similar interests.

**Acceptance Criteria:**

- A user can provide a community name and description.
- The system validates the required information.
- A community is created successfully when valid information is submitted.
- The creator becomes the community moderator.

4: Join and Leave a Community

**As a** registered user,  
**I want to** join or leave a community,  
**So that** I can control which communities I participate in.

**Acceptance Criteria:**

- A user can join an available community.
- A user can leave a community they have joined.
- The system updates the user's membership status.
- A user cannot join the same community more than once.

5: Create a Post

**As a** registered user,  
**I want to** create a post in a community,  
**So that** I can share information, questions, or discussions with other members.

**Acceptance Criteria:**

- A user can select a community for their post.
- A user can enter a post title and content.
- A user can submit the post.
- The system validates the required information.
- The created post appears in the selected community.

6: View Community Posts

**As a** user,  
**I want to** view posts belonging to a specific community,  
**So that** I can follow discussions related to my interests.

**Acceptance Criteria:**

- A user can open a community page.
- The system displays posts belonging to that community.
- Each post displays relevant information such as its title, author, and score.
- The user can open a post to view its details.

7: View the Feed

**As a** user,  
**I want to** view a feed of posts,  
**So that** I can discover and follow discussions across the platform.

**Acceptance Criteria:**

- The system displays a feed containing available posts.
- Each post displays its relevant information.
- A user can open a post from the feed.
- The feed supports the required sorting and pagination features.

8: Upvote and Downvote Posts

**As a** registered user,  
**I want to** upvote or downvote posts,  
**So that** I can express my opinion and help determine which posts are more valuable.

**Acceptance Criteria:**

- A user can upvote a post.
- A user can downvote a post.
- A user can change their vote.
- A user can remove their existing vote.
- Each user can have at most one active vote per post.
- The post score is updated correctly after voting.
- The system handles simultaneous voting requests without producing an incorrect score.

9: Comment on Posts

**As a** registered user,  
**I want to** add comments to posts,  
**So that** I can participate in discussions and share my thoughts.

**Acceptance Criteria:**

- A user can write and submit a comment on a post.
- The system validates the comment content.
- Submitted comments appear under the corresponding post.
- Comments display relevant information such as their author and creation time.

10: Search for Communities and Users

**As a** user,  
**I want to** search for communities and other users,  
**So that** I can easily find people and communities I am interested in.

**Acceptance Criteria:**

- A user can enter a search query.
- The system can search for matching communities.
- The system can search for matching users.
- Matching results are displayed to the user.
- The user can open a community or user profile from the results.

11: Reply to Comments

**As a** registered user,  
**I want to** reply to existing comments,  
**So that** I can participate in conversations and respond to specific points.

**Acceptance Criteria:**

- A user can reply to an existing comment.
- Replies are displayed under their parent comments.
- The system supports nested comment threads.
- The relationship between parent comments and replies is maintained.

12: Sorting posts and loading them in pages on the feed and community pages

**As a** user,  
**I want to** sort posts and navigate through pages of results,  
**So that** I can find relevant posts more easily.

**Acceptance Criteria:**

- A user can sort posts by New.
- A user can sort posts by Top.
- The selected sorting option is applied to the displayed posts.
- Posts are loaded in pages on the feed and community pages.
- A user can navigate to load additional posts.

13: Edit and Delete Own Posts and Comments

**As a** registered user,  
**I want to** edit or delete my own posts and comments,  
**So that** I can manage the content I have shared.

**Acceptance Criteria:**

- A user can edit their own posts.
- A user can delete their own posts.
- A user can edit their own comments.
- A user can delete their own comments.
- The system prevents users from editing or deleting content belonging to other users.
- Changes are reflected in the relevant pages.

14: Community Moderation

**As a** community creator and moderator,  
**I want to** remove posts and comments from my community,  
**So that** I can maintain a safe and appropriate environment for its members.

**Acceptance Criteria:**

- The creator of a community is assigned moderator privileges.
- A moderator can remove posts from their community.
- A moderator can remove comments from their community.
- A moderator cannot moderate content belonging to a different community unless they have the appropriate permissions.
- Removed content is no longer displayed as active content in the community.

**Additional Feature: AI Post Summarization**

**As a** user,  
**I want to** generate an AI summary of a post,  
**So that** I can understand its main points without reading all its content.

**Acceptance Criteria:**

- A user can request a summary of a post.
- The system sends the post content to the AI service.
- The generated summary is displayed to the user.
- The system displays an appropriate error message if summarization fails.