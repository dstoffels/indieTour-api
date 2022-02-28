**Tasks**

<!-- 1. Authorize with JWT to return uid (use auth/authAPI.authorize() HOF) -->
<!-- 2. Filter a list of bands where user is a member -->
<!-- 3. When band is selected, assign user role. (user role included with bandData) -->

<!-- 4. create owner permissions HOF -->

5. create get bandmembers method
6. create admin permissions HOF

**Band User Roles**

1. Member (read)
2. Admin (read, write)
3. Owner (read, write, assign roles)

**Database structure**

- Bands
  - Members
  - Tours
    - Dates
      - Prospects
      - Timeslots
- Venues

**Band object structure**

- Band
  - name: str
  - members: collection[memberObj]
    (what if owner wants to change band name? will have to update bands/:bandId/members[each.band.name] and anywhere else the band name is stored in subcollections)
  - tours: collection[tourObj]

**Member object structure**

- Member
  - uid: str
  - email: str
  - role: str

**Venue object structure**

- Venue
  - name: str
  - location: str
  - type?: str (venue, event)
  - createdBy: str (uid)
  - isPublic: bool
  - contacts: [obj]
    - email: str
    - phone: str
    - other: str
  - notes: str

**Tour object structure**

- Tour
  - name: str
  - startDate: str
  - endDate: str
  - dates: collection[dateObj]

**Date object structure**

- Date
  - date: str
  - type: str enum(show, off, travel)
  - isConfirmed: bool
  - location: str
  - destination : str
  - potentialVenues: collection[prospectObj]
  - schedule: collection[timeslotObj]
  - notes: str

**Timeslot object structure**

- Timeslot
  - type: str enum(event, travel)
  - startTime: int (epoch ms?)
  - startLocation: str
  - endTime: int (epoch ms?)
  - endLocation: str
  - description: str

**Prospect object structure**

- Prospect
  - location: str
  - eventTitle: str
  - hold: int
  - contact: obj
    - email: str
    - phone: str
    - other: str
  - notes: str

What are the requests that client needs to make to server?

**Reading data (all user roles)**

1. Get a list of a user's bands
2. Get a list of a band's tours
3. Get a list of a tour's dates
4. Get a list of a date's events
5. Get a list of a user's venues

**Writing data**

1. Allow user to create a new band (all)
2. Allow user to create a new tour on behalf of a band (admin, owner)
3. Allow user to add dates to a tour on behalf of a band (admin, owner)
