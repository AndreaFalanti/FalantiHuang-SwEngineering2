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
	timestamp: one Timestamp,
	location: one Location,
	submitter: one Citizen,
	violationType: one TrafficViolation,
	vehicle: one Vehicle,
	photo: one PhotoUrl,
	supervisor: lone Authority,
	status: one ReportStatus,
	visualizedBy: set Authority
}


sig Location{
	// Alloy doesn't provide a Float or Double type for performance reasons, so Int is used instead (Simplified version of GPS coordinates)
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
}
{ from != to and from.timestamp < to.timestamp}

sig Intervention{
	location: one Location,
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

fact NoVehiclesWithSameLicensePlate {
	no disj v1,v2: Vehicle | v1.licensePlate = v2.licensePlate
}

/*fact NoUsersWithSameEmail {
	no disj u1,u2: User | u1.email = u2.email
}*/

fact ReportStatusConstraint {
	all r: Report | r.supervisor = none iff r.status = PENDING
}

fact VehicleReportAggregationConstraint {
	all v: Vehicle | some r: Report | v in r.vehicle
}

fact LocationReportOrInterventionAggregationConstraint {
	all l: Location | all r: Report, i: Intervention | l in r.location or l in i.location
}

// new facts
fact TimestampReportOrDataRequestAggregationConstraint {
	all t: Timestamp | all r: Report, d: DataRequest | t in r.timestamp or
		t in d.from or t in d.to
}

fact VehicleReportAggregationConstraint {
	all v: Vehicle | some r: Report | v in r.vehicle 
}

fact InteverntionTypeInterventionAggregationConstraint {
	all it: InterventionType | some i: Intervention | it in i.type
}

fact PlaceLocationAggregationConstraint {
	all p: Place | some l: Location | p in l.place
}

fact AddressPlaceAggregationConstraint {
	all a: Address | some p: Place | a in p.address
}

fact CityPlaceAggregationConstraint {
	all c: City | some p: Place | c in p.city
}

fact PasswordUserAggregationConstraint {
	all p: Password | some u: User | p in u.password
}

fact EmailUserAggregationConstraint {
	all e: Email | one u: User | e in u.email
}

// data requests must be done only on validated reports
fact DataRequestsOnlyValidatedReports {
	all d: DataRequest | d.validReports.status = VALIDATED
}

fact SameCoordinatesHaveSamePlace {
	no disj l1,l2: Location | (l1.latitude = l2.latitude && l1.longitude = l2.longitude) && l1.place != l2.place
}

fact SelectOnlyReportsThatSatisfyRequestFilters {
	all d: DataRequest | all r: Report | r in d.validReports iff 
	(r.timestamp.timestamp >= d.from.timestamp and r.timestamp.timestamp <= d.to.timestamp
	and r.location.place.city = d.locality
	and (d.violationType != none implies r.violationType = d.violationType))
}

fact NoMunicipalityWithSameCity {
	no disj m1,m2: Municipality | m1.city = m2.city
}

fact InterventionMunicipalityLocationConsistency {
	all i: Intervention | all m: Municipality | m in i.accessedBy iff
	i.location.place.city = m.city
}

fact ReportVisualizedByCompetentAuthorities {
	all r: Report | all a: Authority | a in r.visualizedBy iff
	r.location.place.city = a.city
}

fact LicensePlateVehicleAggregationConstraint {
	all l: LicensePlate | one v: Vehicle | l in v.licensePlate
}

fact PhotoUrlReportAggregationConstraint {
	all p: PhotoUrl | one r: Report | p in r.photo
}

fact TrafficViolationReportOrDataRequestAggregationConstraint {
	all t: TrafficViolation | all r: Report, d: DataRequest | t in r.violationType or
		t in d.violationType
}

assert ReportsOfDataRequestSatisfyFilters {
	all d: DataRequest | no r: Report | r in d.validReports and
	not (r.timestamp.timestamp >= d.from.timestamp and r.timestamp.timestamp <= d.to.timestamp
	and r.location.place.city = d.locality
	and (d.violationType != none implies r.violationType = d.violationType))
}

check ReportsOfDataRequestSatisfyFilters for 3

pred dataRequest {
	#Address > 1
	#City > 1
	#DataRequest > 0
	#Authority > 0
	#Report = 3
	#(status :> VALIDATED)  = 2
	#validReports = 1
	#Intervention = 0
}

pred interventionAccessibility {
	#Authority = 0
	#Citizen = 0
	#Municipality = 2
	#Report = 0
	#DataRequest = 0
	#Intervention = 3
}

pred reportAccessibility {
	#Authority = 3
	#Municipality = 0
	#Report = 3
	#DataRequest = 0
	#Intervention = 0
}

run dataRequest for 3
//run interventionAccessibility for 3
//run reportAccessibility for 3
