// src/features/places/places.service.ts
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Place, PlaceType } from './place.entity'

type QueryParams = {
	type?: PlaceType
	q?: string
	swLat?: string
	swLng?: string
	neLat?: string
	neLng?: string
	centerLat?: string
	centerLng?: string
	page?: string
	pageSize?: string
}

@Injectable()
export class PlacesService {
	constructor(@InjectRepository(Place) private readonly repo: Repository<Place>) {}

	// Haversine (meters)
	private haversineExpr(latVar: string, lngVar: string) {
		return `
      2 * 6371000 * ASIN(
        SQRT(
          POWER(SIN(RADIANS(${latVar} - p.lat)/2), 2) +
          COS(RADIANS(p.lat)) * COS(RADIANS(${latVar})) *
          POWER(SIN(RADIANS(${lngVar} - p.lng)/2), 2)
        )
      )
    `
	}

	async findMany(qs: QueryParams) {
		const {
			type,
			q,
			swLat,
			swLng,
			neLat,
			neLng,
			centerLat,
			centerLng,
			page = '1',
			pageSize = '20',
		} = qs

		const take = Math.min(Math.max(Number(pageSize), 1), 100)
		const skip = (Math.max(Number(page), 1) - 1) * take

		const qb = this.repo.createQueryBuilder('p')

		if (type) {
			qb.andWhere('p.type = :type', { type })
		}

		if (q) {
			qb.andWhere('(p.name LIKE :q OR p.description LIKE :q OR p.address LIKE :q)', { q: `%${q}%` })
		}

		// 지도 바운드
		if (swLat && swLng && neLat && neLng) {
			qb.andWhere('p.lat BETWEEN :swLat AND :neLat', {
				swLat: Number(swLat),
				neLat: Number(neLat),
			})
			qb.andWhere('p.lng BETWEEN :swLng AND :neLng', {
				swLng: Number(swLng),
				neLng: Number(neLng),
			})
		}

		// 거리순 정렬
		if (centerLat && centerLng) {
			const dist = this.haversineExpr(':centerLat', ':centerLng')
			qb.addSelect(dist, 'distance')
			qb.setParameters({
				centerLat: Number(centerLat),
				centerLng: Number(centerLng),
			})
			qb.orderBy('distance', 'ASC')
		} else {
			qb.orderBy('p.id', 'DESC')
		}

		qb.take(take).skip(skip)

		// 결과 + 총 개수 동시 계산
		const [rawAndEntities, total] = await Promise.all([
			qb.getRawAndEntities(),
			qb
				.clone()
				.orderBy()
				.offset(undefined as any)
				.limit(undefined as any)
				.getCount(),
		])

		const { raw, entities } = rawAndEntities
		const items = entities.map((e, i) => ({
			...e,
			...(raw[i]?.distance !== undefined ? { distance: Number(raw[i].distance) } : {}),
		}))

		return {
			items,
			total,
			page: Number(page),
			pageSize: take,
			totalPages: Math.ceil(total / take),
		}
	}

	findOne(id: number) {
		return this.repo.findOne({ where: { id } })
	}

	async findByType(type: PlaceType) {
		return this.repo.find({ where: { type } })
	}
}
