**Authorization**

1. Authorize with JWT to return uid
2. Filter a list of bands where user is a member/admin/owner (store owner/admins in members too?)
3. When band is selected, assign user role (custom claim?).
4.

**Band User Roles**

1. Member (read)
2. Admin (read, write)
3. Owner (read, write, assign roles)

**Database structure**

- Bands
  - Users
  - Tours
    - Dates
      - Prospects
      - Timeslots
- Venues

**Band object structure**

- Band
  - members[userObj]
  - tours: collection[tourObj]

**User object structure**

- User
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
