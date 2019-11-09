abstract sig ReportStatus{}
one sig PENDING extends ReportStatus{}
one sig VALIDATED extends ReportStatus{}
one sig INVALIDATED extends ReportStatus{}

sig PhotoUrl{}
sig Address{}
sig State{}
sig Email{}
sig LicensePlate{}
sig Password{}
sig TrafficViolation{}
sig InterventionType{}

// Simplified version of timestamp, using only int to avoid a granular subdivision of time not useful for our constraints
sig Timestamp{
	timestamp: one Int
}

sig Report{
	reportTimestamp: one Timestamp,
	reportLocation: one Location,
	submitter: one Citizen,
	violationType: one TrafficViolation,
	vehicle: one Vehicle,
	photo: one PhotoUrl,
	supervisor: lone Authority,
	status: one ReportStatus,
	visualizedBy: set Authority
}{
	no supervisor iff status = PENDING
	some supervisor implies supervisor.city = reportLocation.place.city
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
	state: one State
}

sig Vehicle{
	licensePlate: one LicensePlate
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
	accessedBy: lone Municipality
}

abstract sig User{
	email: one Email,
	password: one Password
}
sig Municipality extends User{
	city: one City
}
sig Authority extends User{
	city: one City
}
sig Citizen extends User{}

/* ------------------------- constraints ------------------------ */
// composition constraints
fact LocationReportInterventionCompositionConstraint {
	all l: Location | (some r: Report | l in r.reportLocation) or
	(some i: Intervention | l in i.interventionLocation)
	//all l: Location, r: Report | l in r.reportLocation
}

fact TimestampReportDataRequestCompositionConstraint {
	all t: Timestamp | (some r: Report | t in r.reportTimestamp) or
	(some d: DataRequest | t in d.from or t in d.to)
}

fact PhotoUrlReportCompositionConstraint {
	all p: PhotoUrl | one r: Report | p in r.photo
}

fact VehicleReportCompositionConstraint {
	all v: Vehicle | some r: Report | v in r.vehicle
}

fact LicensePlateVehicleCompositionConstraint {
	all l: LicensePlate | one v: Vehicle | l in v.licensePlate
}

fact PlaceLocationCompositionConstraint {
	all p: Place | some l: Location | p in l.place
}

fact AddressPlaceCompositionConstraint {
	all a: Address | some p: Place | a in p.address
}

fact CityPlaceAuthorityMunicipalityCompositionConstraint {
	all c: City | (some p: Place | c in p.city) or 
	(some m: Municipality |c in m.city) or  (some a: Authority |c in a.city)
}

fact PasswordUserCompositionConstraint {
	all p: Password | some u: User | p in u.password
}

fact EmailUserCompositionConstraint {
	all e: Email | one u: User | e in u.email
}

fact StateCityCompositionConstraint {
	all s: State | some c: City | s in c.state
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

fact NoMunicipalityWithSameCity {
	no disj m1,m2: Municipality | m1.city = m2.city
}

fact InterventionMunicipalityLocationConsistency {
	all i: Intervention, m: Municipality | m in i.accessedBy iff
	i.interventionLocation.place.city = m.city
}

fact ReportVisualizedByCompetentAuthorities {
	all r: Report, a: Authority | a in r.visualizedBy iff
	r.reportLocation.place.city = a.city
}

fact NoDifferentInterventionsWithSameLocation {
	no disj i1, i2: Intervention | i1.interventionLocation = i2.interventionLocation and i1.type = i2.type
}

fact NoPlacesWithSameAddressAndCity {
	no disj p1, p2: Place | p1.address = p2. address and p1.city = p2.city
}

/* ------------------------- assertions ------------------------ */
assert ReportSupervisorCanAlsoVisualize {
	all r: Report | r.supervisor in r.visualizedBy
}
check ReportSupervisorCanAlsoVisualize for 10

assert AuthorityCanAccessOnlyReportsFromHisCity {
	all r: Report | no a: Authority | a.city != r.reportLocation.place.city and a in r.visualizedBy
}
check AuthorityCanAccessOnlyReportsFromHisCity for 10

/* ------------------------- worlds ------------------------ */
// shows a world with one data request with at least one valid report
pred dataRequestWithValidReport {
	#(status :> VALIDATED)  = 1
	#(status :> PENDING) = 1
	#validReports >= 1
}
run dataRequestWithValidReport for 3 but exactly 2 Report, exactly 1 DataRequest, 1 City,  1 TrafficViolation, 0 Intervention, 0 Municipality

// shows a world with one data request with zero valid reports
pred dataRequestWithNoValidReport {
	#(status :> VALIDATED)  = 2
	#validReports = 0
}
run dataRequestWithNoValidReport for 3 but exactly 2 Report, exactly 1 DataRequest, 1 City,  1 TrafficViolation, 0 Intervention, 0 Municipality

// shows a world in which some interventions are accessible from municipalities and others are not
pred interventionAccessibility {
	#accessedBy >=  1
	some i: Intervention | i.accessedBy = none
}
run interventionAccessibility for 3 but exactly 2 Municipality, exactly 3 Intervention, exactly 2 Location, 0 Authority, 0 Citizen, 0 Report, 0 DataRequest

// shows a world in which some reports are accessible from some authorities and others are not
pred reportAccessibility {
	#visualizedBy >= 1
	some r: Report | r.visualizedBy = none
}
// at least n+1 entities, where n is number of authorities, because at least 1 citizen is needed for reports and so n+1 emails are needed
run reportAccessibility for 4 but exactly 2 Authority, exactly 2 Report, 2 Location, 0 Municipality, 0 DataRequest, 0 Intervention
