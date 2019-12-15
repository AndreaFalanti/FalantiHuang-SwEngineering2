abstract sig ReportStatus{}
one sig PENDING extends ReportStatus{}
one sig VALIDATED extends ReportStatus{}
one sig INVALIDATED extends ReportStatus{}

abstract sig OrganizationType{}
one sig AUTH_ORG extends OrganizationType{}
one sig MUN_ORG extends OrganizationType{}

sig PhotoUrl{}
sig Address{}
sig Region{}
sig LicensePlate{}
sig Password{}
sig TrafficViolation{}
sig InterventionType{}
sig Domain{}

// Simplified version of timestamp, using only int to avoid a granular subdivision of time not useful for our constraints
sig Timestamp{
	timestamp: one Int
}

sig Email{
	domain: one Domain
}

sig Report{
	reportTimestamp: one Timestamp,
	reportLocation: one Location,
	submitter: one Citizen,
	violationType: one TrafficViolation,
	licensePlate: one LicensePlate,
	photo: some PhotoUrl,
	supervisor: lone AuthorityUser,
	status: one ReportStatus,
	visualizedBy: set AuthorityUser
}{
	no supervisor iff status = PENDING
	some supervisor implies supervisor.organization.city = reportLocation.place.city
}

sig Location{
	// Alloy doesn't provide a Float or Double type, so Int is used instead (Simplified version of GPS coordinates)
	latitude: one Int,
	longitude: one Int,
	place: one Place
}

sig Place{
	address: one Address,
	city: one City
}

sig City{
	region : one Region
}

sig DataRequest{
	from: one Timestamp,
	to: one Timestamp,
	locality: one City,
	violationType: lone TrafficViolation,
	validReports: set Report
}{ 
	from != to and from.timestamp < to.timestamp
	// data requests must be done only on validated reports
	some validReports implies validReports.status = VALIDATED
}

sig Intervention{
	interventionLocation: one Location,
	type: one InterventionType,
	accessedBy: one MunicipalityUser
}

sig Organization{
	orgType: one OrganizationType,
	city: one City,
	domain: one Domain
}

abstract sig User{
	email: one Email,
	password: one Password
}
sig MunicipalityUser extends User{
	organization: one Organization
}{
	organization.orgType = MUN_ORG
	organization.domain = email.domain
}
sig AuthorityUser extends User{
	organization: one Organization
}{
	organization.orgType = AUTH_ORG
	organization.domain = email.domain
}
sig Citizen extends User{}

/* ------------------------- constraints ------------------------ */
// composition constraints
fact LocationReportInterventionCompositionConstraint {
	all l: Location | (some r: Report | l in r.reportLocation) or
	(some i: Intervention | l in i.interventionLocation)
}

fact TimestampReportDataRequestCompositionConstraint {
	all t: Timestamp | (some r: Report | t in r.reportTimestamp) or
	(some d: DataRequest | t in d.from or t in d.to)
}

fact PhotoUrlReportCompositionConstraint {
	all p: PhotoUrl | one r: Report | p in r.photo
}

fact LicensePlateReportCompositionConstraint {
	all l: LicensePlate | some r: Report | l in r.licensePlate
}

fact PlaceLocationCompositionConstraint {
	all p: Place | some l: Location | p in l.place
}

fact AddressPlaceCompositionConstraint {
	all a: Address | some p: Place | a in p.address
}

fact CityPlaceAuthorityMunicipalityUserCompositionConstraint {
	all c: City | (some p: Place | c in p.city) or 
	(some m: MunicipalityUser| c in m.organization.city) or (some a: AuthorityUser| c in a.organization.city)
}

fact PasswordUserCompositionConstraint {
	all p: Password | some u: User | p in u.password
}

fact EmailUserCompositionConstraint {
	all e: Email | one u: User | e in u.email
}

fact RegionCityCompositionConstraint {
	all r: Region | some c: City | r in c.region
}

// other constraints
fact SameCoordinatesHaveSamePlace {
	no disj l1,l2: Location | (l1.latitude = l2.latitude and l1.longitude = l2.longitude) and l1.place != l2.place
}

fact SelectOnlyReportsThatSatisfyRequestFilters {
	all d: DataRequest, r: Report | r in d.validReports iff 
	(r.reportTimestamp.timestamp >= d.from.timestamp and r.reportTimestamp.timestamp <= d.to.timestamp
	and r.reportLocation.place.city = d.locality
	and (d.violationType != none implies r.violationType = d.violationType))
}

fact NoSameOrganizationTypeWithSameCity {
	no disj o1,o2: Organization | (o1.city = o2.city) and (o1.orgType = o2.orgType)
}

fact NoSameOrganizationTypeWithSameDomain {
	no disj o1,o2: Organization | (o1.domain = o2.domain)
}

fact NoCitizenWithOrganizationDomain {
	no c: Citizen | c.email.domain in Organization.domain
}
fact InterventionMunicipalityUserLocationConsistency {
	all i: Intervention, m: MunicipalityUser | m in i.accessedBy iff
	i.interventionLocation.place.city = m.organization.city
}

fact ReportVisualizedByCompetentAuthorities {
	all r: Report, a: AuthorityUser | a in r.visualizedBy iff
	r.reportLocation.place.city = a.organization.city
}

fact NoDifferentInterventionsWithSameLocation {
	no disj i1, i2: Intervention | i1.interventionLocation = i2.interventionLocation and i1.type = i2.type
}

fact NoPlacesWithSameAddressAndCity {
	no disj p1, p2: Place | p1.address = p2. address and p1.city = p2.city
}

fact NoSameReportFromSameCitizenAtTheSameTime {
	no r1, r2: Report | r1.submitter = r2.submitter and r1 != r2
}

fact NoInterventionsWithoutMunicipalityUser {
	all i: Intervention | some m: MunicipalityUser | i.interventionLocation.place.city = m.organization.city
}

/* ------------------------- assertions ------------------------ */
assert ReportSupervisorCanAlsoVisualize {
	all r: Report | r.supervisor in r.visualizedBy
}
check ReportSupervisorCanAlsoVisualize for 10

assert AuthorityUserCanAccessOnlyReportsFromHisCity {
	all r: Report | no a: AuthorityUser | a.organization.city != r.reportLocation.place.city and a in r.visualizedBy
}
check AuthorityUserCanAccessOnlyReportsFromHisCity for 10

assert AuthorityOfSameOrganizationVisualizeSameReports{
	all disj a1,a2: AuthorityUser | #visualizedBy.a1 > 0 implies (a1.organization = a2.organization iff visualizedBy.a1 = visualizedBy.a2)
}
check AuthorityOfSameOrganizationVisualizeSameReports for 10

assert MunicipalityOfSameOrganizationVisualizeSameInterventions{
	all disj m1,m2: MunicipalityUser | #accessedBy.m1 > 0 implies (m1.organization = m2.organization iff accessedBy.m1 = accessedBy.m2)
}
check MunicipalityOfSameOrganizationVisualizeSameInterventions for 10
/* ------------------------- worlds ------------------------ */
// shows a world with one data request with at least one valid report
pred dataRequestWithValidReport {
	#(status :> VALIDATED)  = 1
	#(status :> PENDING) = 1
	#validReports >= 1
}
run dataRequestWithValidReport for 3 but exactly 2 Report, exactly 1 DataRequest, 1 City,  1 TrafficViolation, 0 Intervention, 0 MunicipalityUser

// shows a world with one data request with zero valid reports
pred dataRequestWithNoValidReport {
	#(status :> VALIDATED)  = 1
	#(status :> INVALIDATED)  = 1
	#validReports = 0
}
run dataRequestWithNoValidReport for 3 but exactly 2 Report, exactly 1 DataRequest, 1 City,  1 TrafficViolation, 0 Intervention, 0 MunicipalityUser

// shows a world in which interventions are accessible only from MunicipalityUser in which they are located in
pred interventionAccessibility {
	some i1, i2: Intervention | i1.interventionLocation.place.city != i2.interventionLocation.place.city
}
run interventionAccessibility for 3 but exactly 2 MunicipalityUser, exactly 3 Intervention, exactly 2 Location, 0 AuthorityUser, 0 Citizen, 0 Report, 0 DataRequest

// shows a world in which some reports are accessible from some authorities and others are not
pred reportAccessibility {
	#visualizedBy >= 1
	some r: Report | r.visualizedBy = none
}
// at least n+1 entities, where n is number of authorities, because at least 1 citizen is needed for reports and so n+1 emails are needed
run reportAccessibility for 4 but exactly 2 AuthorityUser, exactly 2 Report, 2 Location, 0 MunicipalityUser, 0 DataRequest, 0 Intervention
