**Tasks**

<!-- - Authorize with JWT to return uid (use auth/authAPI.authorize() HOF) -->
<!-- - Filter a list of bands where user is a member -->
<!-- - When band is selected, assign user role. (user role included with bandData) -->
<!-- - create owner permissions HOF (authorizeOwner) -->
<!-- - create admin permissions HOF (authorizeAdmin) -->
<!-- created member permissions HOF (authorizeMember) -->
<!-- - implement band members routes & views
    - - addBandMember contains unique email validation, calls bandAPI.addMemberToBand()
      - removeBandMember prevents owner from being deleted
      - changeMemberRole() automatically swap ownership if req.body.role === owner -->

- implement band tours routes & views
<!-- - - will there be an auto-generated "general tour" so users can add dates without affiliating it with a tour? (yes there is) -->

- update all member instances when user changes name or deletes self (INCOMPLETE)

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
    <!-- (what if owner wants to change band name? will have to update bands/:bandId/members[each.band.name] and anywhere else the band name is stored in subcollections) check! -->
  - tours: collection[tourObj]

**Member object structure**

- Member
  - id: str
  - name: str
  - uid: str
  - email: str
  - bandData: BandData(id, name, memberRole, path)

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
  (do we even care about start/endDates?)

  - name: str (unique)
  - notes: str
  - dates: collection[dateObj]
  - startDate: str ???
    (cannot overlap endDate of other tours?)
  - endDate: str ???
    (cannot overlap startDate of other tours?)
  - isPerpetual: bool
    (always false except for general tour)
  - isArchived: bool

**Date object structure**

- Date
  - date: str
  - type: str enum(show, off, travel)
  - isConfirmed: bool
  - location: str
  - venue: ref or map ?? (allow user to store shallow venue details in the event they don't want to save the venue to the database?)
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
